import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { GraphcalcsService } from '../../services/graphcalcs.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage{
  
  @ViewChild('registerChart') registerChart;
  @ViewChild('ageChart') ageChart;
  @ViewChild('genderChart') genderChart;
  @ViewChild('raceChart') raceChart;
  @ViewChild('rhythmChart') rhythmChart;
  @ViewChild('roscChart') roscChart;
  @ViewChild('nationalChart') nationalChart;

  
  public patient: boolean = false;
  public personal: boolean = true;
  public better: boolean = true;
  public colorArray: any = [];
  public registers: Chart;
  public age: Chart;
  public race: Chart;
  public gender: Chart;
  public rhythm: Chart;
  public rosc: Chart;
  public nat: Chart;


  constructor(
    public graphcalc:GraphcalcsService,
  ) {}

  ionViewDidEnter() {
    this.generateColorArray();
    this.createRegistersChart();
    this.createPersonalChart();
    this.createNationalChart();  
    this.graphcalc.getNationalRegCoef();  
    this.nationalInformationCard()
  }

  selectChart(selectedChart: string){
    if (selectedChart === 'patient'){
      this.patient = false;
      this.personal = true;
    }
    if (selectedChart === 'personal'){
      this.patient = true;
      this.personal = false;   
    }
  }

  nationalInformationCard(){
    if(this.graphcalc.returnRatesGraph[0]>this.graphcalc.returnRatesGraph[1]){
      this.better = true;
    }
    else{
      this.better = false;
    }
  }

  generateColorArray() {
    this.colorArray.push('#22577A')
    this.colorArray.push('#38A3A5')
    this.colorArray.push('#57CC99')
    this.colorArray.push('#80ED99')
    this.colorArray.push('#C7F9CC')
    this.colorArray.push('#95B2B0')
    this.colorArray.push('#647AA3')
    this.colorArray.push('#334195')
    this.colorArray.push('#020887')
    this.colorArray.push('#000000')
  }

  async createRegistersChart() {
    this.registers = new Chart(await this.registerChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Complete', 'Partially/Non complete'],
        datasets: [{
          data: await this.graphcalc.getRegistersValues(),
          backgroundColor: this.colorArray, 
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {}
    });
  }

  async createPersonalChart(){
    this.age = new Chart(await this.ageChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['20 or less yo', 
          '21 - 30 yo', 
          '31 - 40 yo', 
          '41 - 50 yo', 
          '51 - 60 yo', 
          '61 - 70 yo', 
          '71 - 80 yo', 
          '81 - 90 yo', 
          '91+ yo', 
          'Not specified'],
        datasets: [{
          label: 'Number of patients',
          data: await this.graphcalc.getAgesFrecuency(),
          backgroundColor: this.colorArray, 
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
              ticks: {
                  stepSize: 1
              }
          }]
      }
      }
    });
    this.gender = new Chart(await this.genderChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Femenine', 'Masculine', 'Unespecified'],
        datasets: [{
          data: await this.graphcalc.getGenderFrecuency(),
          backgroundColor: this.colorArray, 
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {}
    });
    this.race = new Chart(await this.raceChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Caucasian', 'Native American', 'African American', 'Asian', 'Pacific Islander', 'Not specified'],
        datasets: [{
          data: await this.graphcalc.getRaceFrecuency(),
          backgroundColor: this.colorArray, 
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {}
    });
    this.rhythm = new Chart(await this.rhythmChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['VF', 'pVT', 'Asystole', 'PEA', 'Not specified'],
        datasets: [{
          data: await this.graphcalc.getRhythmFrecuency(),
          backgroundColor: this.colorArray, 
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {}
    });
    this.rosc = new Chart(await this.roscChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Yes', 'No', 'Not specified'],
        datasets: [{
          data: await this.graphcalc.getRoscFrecuency(),
          backgroundColor: this.colorArray, 
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {}
    });
  }

  async createNationalChart(){
    this.nat = new Chart(await this.nationalChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Net', 'Projected**'],
        datasets: [{
          label:'Percentage',
          data: await this.graphcalc.returnRatesGraph(),
          backgroundColor: this.colorArray, 
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
              ticks: {
                  suggestedMin: 0,
                  suggestedMax: 100
              }
          }]
      }
      }
    });
  }
}
