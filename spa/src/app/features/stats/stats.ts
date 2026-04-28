import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser,CommonModule  } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, ChartModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);

  // Tus datos originales de transformaciones
  rawCharacters = [
    {
    "id": 1,
    "name": "Goku SSJ",
    "image": "https://dragonball-api.com/transformaciones/goku_ssj.webp",
    "ki": "3 Billion",
    "deletedAt": null
  },
  {
    "id": 2,
    "name": "Goku SSJ2",
    "image": "https://dragonball-api.com/transformaciones/goku_ssj2.webp",
    "ki": "6 Billion",
    "deletedAt": null
  },
  {
    "id": 3,
    "name": "Goku SSJ3",
    "image": "https://dragonball-api.com/transformaciones/goku_ssj3.webp",
    "ki": "24 Billion",
    "deletedAt": null
  },
  {
    "id": 4,
    "name": "Goku SSJ4",
    "image": "https://dragonball-api.com/transformaciones/goku_ssj4.webp",
    "ki": "2 Quadrillion",
    "deletedAt": null
  },
  {
    "id": 5,
    "name": "Goku SSJB",
    "image": "https://dragonball-api.com/transformaciones/goku_ssjb.webp",
    "ki": "9 Quintillion",
    "deletedAt": null
  },
  {
    "id": 7,
    "name": "Vegeta SSJ",
    "image": "https://dragonball-api.com/transformaciones/vegeta SSJ (2).webp",
    "ki": "330.000.000",
    "deletedAt": null
  },
  {
    "id": 8,
    "name": "Vegeta SSJ2",
    "image": "https://dragonball-api.com/transformaciones/vegeta SSJ2.webp",
    "ki": "24 Billion",
    "deletedAt": null
  },
  {
    "id": 9,
    "name": "Vegeta SSJ4",
    "image": "https://dragonball-api.com/transformaciones/vegeta ssj4.webp",
    "ki": "1.8 Trillion",
    "deletedAt": null
  },
  {
    "id": 10,
    "name": "Vegeta SSJB",
    "image": "https://dragonball-api.com/transformaciones/vegeta SSJB.webp",
    "ki": "100 Quintillion",
    "deletedAt": null
  },
  {
    "id": 11,
    "name": "Vegeta Mega Instinc Evil",
    "image": "https://dragonball-api.com/transformaciones/vegeta mega instinto.webp",
    "ki": "19.84 Septillion",
    "deletedAt": null
  },
  {
    "id": 12,
    "name": "Piccolo Super Namekian",
    "image": "https://dragonball-api.com/transformaciones/Piccolo super namekiano.webp",
    "ki": "2.175 Billion",
    "deletedAt": null
  },
  {
    "id": 13,
    "name": "Piccolo Orange",
    "image": "https://dragonball-api.com/transformaciones/picolo orange.webp",
    "ki": "41.25 Quintillion",
    "deletedAt": null
  },
  {
    "id": 14,
    "name": "Freezer 2nd Form",
    "image": "https://dragonball-api.com/transformaciones/freezer 2nd forma.webp",
    "ki": "1.060.000",
    "deletedAt": null
  },
  {
    "id": 15,
    "name": "Freezer 3rd Form",
    "image": "https://dragonball-api.com/transformaciones/Freezer_3.webp",
    "ki": "2.120.000",
    "deletedAt": null
  },
  {
    "id": 16,
    "name": "Freezer Perfect Form",
    "image": "https://dragonball-api.com/transformaciones/render_freezer_perfect_form_by_poh2000-d4n0ewd.webp",
    "ki": "60.000.000",
    "deletedAt": null
  },
  {
    "id": 17,
    "name": "Freezer Perfect Form (Golden)",
    "image": "https://dragonball-api.com/transformaciones/freezer_gold.webp",
    "ki": "100 Quintillion",
    "deletedAt": null
  },
  {
    "id": 18,
    "name": "Zarbon Monster",
    "image": "https://dragonball-api.com/transformaciones/zarbon monster.webp",
    "ki": "30.000",
    "deletedAt": null
  },
  {
    "id": 19,
    "name": "Imperfect Form",
    "image": "https://dragonball-api.com/transformaciones/cell imperfect.webp",
    "ki": "370.000.000",
    "deletedAt": null
  },
  {
    "id": 20,
    "name": "Semi Perfect Form",
    "image": "https://dragonball-api.com/transformaciones/Semi-Perfect_Cell.webp",
    "ki": "897.000.000",
    "deletedAt": null
  },
  {
    "id": 21,
    "name": "Super Perfect Form",
    "image": "https://dragonball-api.com/transformaciones/cell perfect.webp",
    "ki": "10.970.000.000",
    "deletedAt": null
  },
  {
    "id": 22,
    "name": "Gohan SSJ",
    "image": "https://dragonball-api.com/transformaciones/gohan_ssj-removebg-preview.webp",
    "ki": "4.700.000.000",
    "deletedAt": null
  },
  {
    "id": 23,
    "name": "Gohan SSJ2",
    "image": "https://dragonball-api.com/transformaciones/Gohan_joven_ssj2.webp",
    "ki": "10.200.000.000",
    "deletedAt": null
  },
  {
    "id": 24,
    "name": "Gohan Ultimate",
    "image": "https://dragonball-api.com/transformaciones/gohan_ultimate.webp",
    "ki": "43.000.000.000",
    "deletedAt": null
  },
  {
    "id": 25,
    "name": "Gohan Beast",
    "image": "https://dragonball-api.com/transformaciones/beast_gohan___dragon_ball_super_super_hero_by_rmrlr2020_dfbqvta-pre.webp",
    "ki": " 25.6 Septillion",
    "deletedAt": null
  },
  {
    "id": 26,
    "name": "Trunks SSJ",
    "image": "https://dragonball-api.com/transformaciones/trunks_ssj-removebg-preview.webp",
    "ki": "905.000.000",
    "deletedAt": null
  },
  {
    "id": 27,
    "name": "Trunks SSJ2",
    "image": "https://dragonball-api.com/transformaciones/trunks ssj2.webp",
    "ki": "18.000.000.000",
    "deletedAt": null
  },
  {
    "id": 28,
    "name": "Trunks SSJ3",
    "image": "https://dragonball-api.com/transformaciones/trunks ssj3.webp",
    "ki": "1.25 Billion",
    "deletedAt": null
  },
  {
    "id": 29,
    "name": "Trunks Rage",
    "image": "https://dragonball-api.com/transformaciones/trunks ssj iracundo.webp",
    "ki": "17.5 Quintillion ",
    "deletedAt": null
  },
  {
    "id": 30,
    "name": "Gotenks SSJ",
    "image": "https://dragonball-api.com/transformaciones/gotenks ssj.webp",
    "ki": "5.7 Billion",
    "deletedAt": null
  },
  {
    "id": 31,
    "name": "Gotenks SSJ3",
    "image": "https://dragonball-api.com/transformaciones/Gotenks_SSJ3.webp",
    "ki": "45.6 Billion",
    "deletedAt": null
  },
  {
    "id": 32,
    "name": "Super Buu",
    "image": "https://dragonball-api.com/transformaciones/Super_Buu_Artwork.webp",
    "ki": "5.670.000.000",
    "deletedAt": null
  },
  {
    "id": 33,
    "name": "Majin Buu (Gotenks)",
    "image": "https://dragonball-api.com/transformaciones/Gotenks-Buu-removebg-preview.webp",
    "ki": "12.300.000.000",
    "deletedAt": null
  },
  {
    "id": 34,
    "name": "Majin Buu (Gohan)",
    "image": "https://dragonball-api.com/transformaciones/Super_Buu_Gohan_Absorbido.webp",
    "ki": "14.800.000.000",
    "deletedAt": null
  },
  {
    "id": 35,
    "name": "Majin Buu (Pure)",
    "image": "https://dragonball-api.com/transformaciones/majin buu pure.webp",
    "ki": "4.000.000.000",
    "deletedAt": null
  },
  {
    "id": 36,
    "name": "Gogeta SSJ",
    "image": "https://dragonball-api.com/transformaciones/gogeta_ssj_render_2_by_ssjrose890_de2z0ra-pre.webp",
    "ki": "6.3 sextillion",
    "deletedAt": null
  },
  {
    "id": 37,
    "name": "Gogeta SSJ4",
    "image": "https://dragonball-api.com/transformaciones/GOGETA SSJ4.webp",
    "ki": "168 quadrillion",
    "deletedAt": null
  },
  {
    "id": 38,
    "name": "Gogeta SSJB",
    "image": "https://dragonball-api.com/transformaciones/gogeta SSJB.webp",
    "ki": "12.6 septillion",
    "deletedAt": null
  },
  {
    "id": 39,
    "name": "Gogeta SSJB Evolved",
    "image": "https://dragonball-api.com/transformaciones/gogeta__bm__ssb_evolution___1__con_aura__by_ssjrose890_df682g0-fullview.webp",
    "ki": "1.26 octillion",
    "deletedAt": null
  },
  {
    "id": 40,
    "name": "Vegetto SSJ",
    "image": "https://dragonball-api.com/transformaciones/Vegetto.webp",
    "ki": "9 Trillion",
    "deletedAt": null
  },
  {
    "id": 41,
    "name": "Vegetto SSJB",
    "image": "https://dragonball-api.com/transformaciones/VEGITO SSJB.webp",
    "ki": "10.8 Septillion",
    "deletedAt": null
  },
  {
    "id": 42,
    "name": "Super Janemba",
    "image": "https://dragonball-api.com/transformaciones/Super-Janemba_artwork_SDBH.webp",
    "ki": "75 Billion",
    "deletedAt": null
  },
  {
    "id": 43,
    "name": "Broly SSJ Legendary",
    "image": "https://dragonball-api.com/transformaciones/Broly_Super_Saiyajin_Legendario_1.webp",
    "ki": "11.2 Septillion",
    "deletedAt": null
  },
  {
    "id": 44,
    "name": "Goku Ultra Instinc",
    "image": "https://dragonball-api.com/transformaciones/goku_ultra.webp",
    "ki": "90 Septillion",
    "deletedAt": null
  }
    // ... añade aquí el resto de tu JSON
  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  // Convierte "Septillion", "Billion", etc a valores numéricos reales
  private parseKi(kiStr: string): number {
    const cleanStr = kiStr.toLowerCase().replace(/\./g, '').trim();
    const parts = cleanStr.split(' ');
    let value = parseFloat(parts[0]);
    const unit = parts[1];

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

    return unit ? value * (units[unit] || 1) : value;
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);

    // 1. Procesar y ordenar de MENOR a MAYOR
    const sortedData = this.rawCharacters
      .map(c => ({ ...c, numericKi: this.parseKi(c.ki) }))
      .sort((a, b) => a.numericKi - b.numericKi);

    this.data = {
      labels: sortedData.map(c => c.name),
      datasets: [
        {
          label: 'Nivel de Ki',
          // Gradiente de color: de azul (débil) a naranja/rojo (poderoso)
          backgroundColor: sortedData.map((_, i) => 
            i < sortedData.length / 2 ? '#3B82F6' : '#F59E0B'),
          data: sortedData.map(c => c.numericKi),
          borderRadius: 4
        }
      ]
    };

    this.options = {
      indexAxis: 'y', // Barra Horizontal
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => ` Poder: ${sortedData[context.dataIndex].ki}`
          }
        }
      },
      scales: {
        x: {
          type: 'logarithmic', // Crucial para ver desde 30,000 hasta Octillones
          ticks: { color: '#94a3b8', font: { size: 10 } },
          grid: { color: '#334155' }
        },
        y: {
          ticks: { color: '#f8fafc', font: { size: 11 } },
          grid: { display: false }
        }
      }
    };
  }
}