import { Component, OnInit, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { HeadersComponent } from '../../shared/components/headers/headers';
import { CardModule } from 'primeng/card';
import { CharacterService } from '../../core/services/character.service';
import { Transformation, Detail } from '../../shared/interfaces/models/character.model';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CharacterDetailComponent } from '../characters/components/character-detail/character-detail';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, ChartModule, HeadersComponent, CardModule, DynamicDialogModule],
  providers: [DialogService],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  private charService = inject(CharacterService);
  private platformId = inject(PLATFORM_ID);
  private dialogService = inject(DialogService);
  
  // --- SIGNALS ---
  public ref: DynamicDialogRef | undefined | null;
  public isLoading = signal<boolean>(false);
  public sortedCharacters = signal<any[]>([]);
  public data = signal<any>(null);
  public options = signal<any>(null);
  
  // Signal para guardar la selección del modal
  private modalSelected = signal<any>({});

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  private parseKi(kiStr: string): number {
    if (!kiStr || kiStr.toLowerCase().includes('unknown')) return 1;
    let cleanStr = kiStr.toLowerCase().trim();
    const units: { [key: string]: number } = { 
      'million': 1e6, 'billion': 1e9, 'trillion': 1e12, 'quadrillion': 1e15, 
      'quintillion': 1e18, 'sextillion': 1e21, 'septillion': 1e24, 'octillion': 1e27 
    };
    let multiplier = 1;

    for (const [unit, val] of Object.entries(units)) {
      if (cleanStr.includes(unit)) {
        multiplier = val;
        cleanStr = cleanStr.replace(unit, '').replace(',', '.').trim();
        break;
      }
    }

    if (multiplier === 1) cleanStr = cleanStr.replace(/\./g, '');
    const numericValue = parseFloat(cleanStr);
    return isNaN(numericValue) || numericValue <= 0 ? 1 : numericValue * multiplier;
  }

  async handleLoadData(): Promise<Transformation[]> {
    try {
      this.isLoading.set(true);
      const response = await this.charService.getTransformations();
      return response || [];
    } catch (error) {
      console.error("Error cargando transformaciones:", error);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }

  async initChart() {
    const rawCharacters = await this.handleLoadData();
    if (rawCharacters.length === 0) return;

    // Procesar y ordenar datos
    const sorted = rawCharacters
      .map(c => ({ ...c, numericKi: this.parseKi(c.ki) }))
      .sort((a, b) => a.numericKi - b.numericKi);

    this.sortedCharacters.set(sorted);

    // Generar colores
    const backgroundColors = sorted.map((_, i) => {
      const ratio = i / (sorted.length - 1);
      const r = Math.floor(59 + ratio * (245 - 59));
      const g = Math.floor(130 + ratio * (158 - 130));
      const b = Math.floor(246 + ratio * (11 - 246));
      return `rgb(${r}, ${g}, ${b})`;
    });

    // Configurar Data Signal
    this.data.set({
      labels: sorted.map(c => c.name),
      datasets: [{
        label: 'Nivel de Ki',
        data: sorted.map(c => c.numericKi),
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.8
      }]
    });

    // Configurar Options Signal
    this.options.set({
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => ` Poder: ${this.sortedCharacters()[context.dataIndex].ki}`
          }
        }
      },
      scales: {
        x: {
          type: 'logarithmic',
          min: 1000,
          ticks: {
            color: '#94a3b8',
            callback: (value: any) => {
              if (value === 0) return '0';
              const remain = value / (Math.pow(10, Math.floor(Math.log10(value))));
              return (remain === 1 || remain === 2 || remain === 5) ? value.toExponential() : '';
            }
          },
          grid: { color: '#334155' }
        },
        y: {
          ticks: { color: '#f8fafc', autoSkip: false },
          grid: { display: false }
        }
      }
    });
  }

  async onChartClick(event: any) {
    const index = event.element.index;
    const personajeSeleccionado = this.sortedCharacters()[index];
    
    this.isLoading.set(true);
    
    try {
      const response = await this.charService.getCharacterTransformations(personajeSeleccionado.id);
      const resCharacter = await this.charService.getCharacter(response.character.id);

      this.modalSelected.set({
        transformations: personajeSeleccionado,
        response: resCharacter
      });

      this.ref = this.dialogService.open(CharacterDetailComponent, {
        header: `Información de ${personajeSeleccionado.name}`,
        width: '50%',
        data: this.modalSelected()
      });

    } catch (error) {
      console.error("Error al obtener detalles:", error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
