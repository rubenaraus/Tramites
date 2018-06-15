import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TramiteService } from '../../services/tramite.service';
import { Tramite } from '../../clases/tramite';
import { Abono } from '../../clases/abono';
import { NgForm } from '@angular/forms';
import { AbonoService } from '../../services/abono.service';
import * as jsPdf from 'jspdf';

@Component({
  selector: 'pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit, OnDestroy {

     subscriber: any;
     tramiteActivo: Tramite = new Tramite();
     abonoActivo: Abono = new Abono();
     abonos: Abono[] = [];
     abonado: number = 0;

     fecha: any;
     cantidad_abonada: number;
     descripcion: string = "";
     loading: boolean = true;

    constructor(private route: ActivatedRoute,
                private tramiteService: TramiteService,
                private abonosService: AbonoService) {
    }

    ngOnInit() {
        let key;
        this.subscriber = this.route.params
        .subscribe(params => {
            key = params['key'];
            console.log('key', key)
        });

        this.cargarTramiteActivo(key)
        .then(() => {
            this.cargarAbonos();
        });
    }

    registrarAbono() {
        if (this.abonoActivo.$key) {
            //actualiza abono
            console.log('actualizar abono');
            console.log(this.abonoActivo);
            this.abonosService.actualizaTramite(this.abonoActivo)
            .then((response: any) => {
                console.log(response);
                if (response.status == 'success') {
                    this.cargarAbonos();
                }
            });
        } else {
            //nuevo abono
            console.log('agregar abono');
            console.log(this.abonoActivo);
            if (!this.abonoActivo.fecha) {
                this.abonoActivo.fecha = new Date();
            }
            this.abonosService.agregarAbono(this.abonoActivo)
            .then(resultKey => {
                if (resultKey) {
                    console.log('abono agregado');
                    this.cargarTramiteActivo(this.tramiteActivo.$key);
                    this.cargarAbonos();
                }
            });
        }
        this.abonoActivo = new Abono();
    }

    cargarAbonos(){
        this.abonosService.obtenerAbonos()
        .then((abonos: any) => {
            this.abonos = abonos;
            this.loading = false;

            if (this.abonos) {
                this.abonado = 0;
                for (let i = 0; i < this.abonos.length; i++) {
                    this.abonado += this.abonos[i].cantidad_abonada;
                }
                let restante = this.tramiteActivo.costo_tramite - this.abonado;
                this.tramiteService.actualizarCantidadDeudora(this.tramiteActivo.$key, restante);
                this.cargarTramiteActivo(this.tramiteActivo.$key);
            }
        });
    }

    cargarAbono($key){
        this.abonosService.obtenerAbono($key)
        .then((abono: Abono) => {
            this.abonoActivo = abono;
            this.abonoActivo.$key = $key;
        });
    }

    cargarTramiteActivo(key){
        return this.abonosService.obtenerTramiteRef(key)
        .then((data: Tramite) => {
            this.tramiteActivo = data;
            // this.cargarAbonos();
        });
    }

    createPdf(){
        let doc = new jsPdf();

        doc.text('Hola PDF', 10, 10);

        doc.save('test.pdf');
    }

    ngOnDestroy(): void {
        this.subscriber.unsubscribe();
    }

}
