import { Component, OnInit, inject, PLATFORM_ID, signal ,ChangeDetectorRef} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { HeadersComponent } from '../../shared/components/headers/headers';
import { CardModule } from 'primeng/card';
import { CharacterService } from '../../core/services/character.service';
import { Transformation } from '../../shared/interfaces/models/character.model';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog'; // Añade DynamicDialogModule
import { CharacterDetailComponent } from '../characters/components/character-detail/character-detail'; 
import { Detail, ModalCharacter } from '../../shared/interfaces/models/character.model'

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, ChartModule, HeadersComponent, CardModule,DynamicDialogModule],
  providers: [
    DialogService
  ],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  ref: DynamicDialogRef | undefined | null;
  private cdr = inject(ChangeDetectorRef); 
  private charService = inject(CharacterService);
  private platformId = inject(PLATFORM_ID);
  private dialogService = inject(DialogService);
  modalSelected:any={};
  isLoading = signal<boolean>(false);
  rawCharacters: Transformation[] = [];
  sortedCharacters: any[] = []
  data: any;
  options: any;

  ngOnInit() {
    // Solo inicializamos si estamos en el navegador (evita errores de SSR con Chart.js)
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  /**
   * Convierte strings de Ki complejos a números reales para el gráfico.
   * Maneja formatos como "3 Billion", "19.84 Septillion" o "330.000.000".
   */
  private parseKi(kiStr: string): number {
    if (!kiStr || kiStr.toLowerCase().includes('unknown')) return 1; // 1 para evitar error en log scale

    let cleanStr = kiStr.toLowerCase().trim();
    
    const units: { [key: string]: number } = {
      'million': 1e6,
      'billion': 1e9,
      'trillion': 1e12,
      'quadrillion': 1e15,
      'quintillion': 1e18,
      'sextillion': 1e21,
      'septillion': 1e24,
      'octillion': 1e27
    };

    let multiplier = 1;

    // Buscamos si existe una unidad de palabra (Billion, Septillion, etc.)
    for (const [unit, val] of Object.entries(units)) {
      if (cleanStr.includes(unit)) {
        multiplier = val;
        // Mantenemos el punto decimal para parseFloat, quitamos la palabra
        cleanStr = cleanStr.replace(unit, '').replace(',', '.').trim();
        break;
      }
    }

    // Si NO se encontró una unidad de palabra, es un número con puntos de miles (ej: 330.000.000)
    if (multiplier === 1) {
      cleanStr = cleanStr.replace(/\./g, '');
    }

    const numericValue = parseFloat(cleanStr);
    return isNaN(numericValue) || numericValue <= 0 ? 1 : numericValue * multiplier;
  }

  async handleLoadData() {
    try {
      this.isLoading.set(true);
      const response = await this.charService.getTransformations();
      this.rawCharacters = response || [];
    } catch (error) {
      console.error("Error cargando transformaciones:", error);
      this.rawCharacters = [];
    } finally {
      this.isLoading.set(false);
    }
  }

async initChart() {
    await this.handleLoadData();

    if (this.rawCharacters.length === 0) return;

    // 1. CORRECCIÓN: Guardamos el array ordenado en una propiedad de la CLASE
    // Así el índice del gráfico coincidirá con este array en el evento click
    this.sortedCharacters = this.rawCharacters
      .map(c => ({ ...c, numericKi: this.parseKi(c.ki) }))
      .sort((a, b) => a.numericKi - b.numericKi);

    // 2. Generamos colores basados en la propiedad de la clase
    const backgroundColors = this.sortedCharacters.map((_, i) => {
        const ratio = i / (this.sortedCharacters.length - 1);
        const r = Math.floor(59 + ratio * (245 - 59));
        const g = Math.floor(130 + ratio * (158 - 130));
        const b = Math.floor(246 + ratio * (11 - 246));
        return `rgb(${r}, ${g}, ${b})`;
    });

    const chartData = {
      labels: this.sortedCharacters.map(c => c.name),
      datasets: [{
        label: 'Nivel de Ki',
        data: this.sortedCharacters.map(c => c.numericKi),
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.8
      }]
    };

    setTimeout(() => {
      this.data = chartData;
      this.options = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              // Usamos el Ki original (string) para el tooltip
              label: (context: any) => ` Poder: ${this.sortedCharacters[context.dataIndex].ki}`
            }
          }
        },
        scales: {
          x: {
            type: 'logarithmic',
            min: 1000,
            ticks: {
              color: '#94a3b8',
              callback: function(value: any) {
                if (value === 0) return '0';
                const remain = value / (Math.pow(10, Math.floor(Math.log10(value))));
                if (remain === 1 || remain === 2 || remain === 5) {
                  return value.toExponential();
                }
                return '';
              }
            },
            grid: { color: '#334155' }
          },
          y: {
            ticks: { 
              color: '#f8fafc',
              autoSkip: false 
            },
            grid: { display: false }
          }
        }
      };

      // Forzamos la detección de cambios para que el gráfico aparezca al instante
      this.cdr.detectChanges(); 
    }, 50);
}


async onChartClick(event: any) {
    const index = event.element.index;
    const personajeSeleccionado = this.sortedCharacters[index]; 
    const{id}=personajeSeleccionado;
    const response = await this.charService.getCharacterTransformations(id);
    try{
      const {character}= response;
      const{id:idCharacter}=character;
      const res = await this.charService.getCharacter(idCharacter);
      try{
        this.modalSelected= {
            type:false, 
            transformations:personajeSeleccionado, 
            response:res};
        console.log("this.modalSelected",this.modalSelected);
        this.ref = this.dialogService.open(CharacterDetailComponent, {
          header: `Editar a ${response.name}`, // Usamos el nombre para el título
          width: '50%',
          data: this.modalSelected // Pasamos el ModalCharacter completo al hijo
        });
      }
      catch(e){
        console.error("Error al obtener transformaciones:", e);
        // Opcional: limpiar datos previos si falla
        this.rawCharacters = [];
    } finally {
        this.isLoading.set(false);
        this.cdr.detectChanges();
    }
    } catch (error) {
        console.error("Error al obtener transformaciones:", error);
        // Opcional: limpiar datos previos si falla
        this.rawCharacters = [];
    } finally {
        this.isLoading.set(false);
        this.cdr.detectChanges();
    }
    
}


}
