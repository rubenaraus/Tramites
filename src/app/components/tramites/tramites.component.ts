import { Component, OnInit } from '@angular/core';
import { TramiteService } from '../../services/tramite.service';
import { Tramite } from '../../clases/tramite';
import { NgForm } from '@angular/forms';
import { AngularFireList, ChildEvent } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'tramites',
  templateUrl: './tramites.component.html',
  styleUrls: ['./tramites.component.css']
})
export class TramitesComponent implements OnInit {

    tramites: Tramite[] = [];

    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    localidad: string;
    telefono: string;
    tipo_tramite: string;
    concepto_tramite: string;
    costo_tramite: number;
    complete: boolean;

    constructor(private tramiteService: TramiteService) {}

    ngOnInit() {
        this.getTramites();
    }

    guardarTramite(tramite: NgForm){
        this.tramiteService.guardarTramite(tramite.value)
            .then((response:any) => {
                console.log(response.status);

                if (response.status === 'success') {
                    console.log('dentro del success');
                    this.getTramites();
                }
            }).catch( error => console.log(error));
    }

    getTramites(){
        this.tramiteService.obtenerTramites()
        .then(tramites => {
            if(tramites){
                this.tramites = tramites;
            }
        }).catch(error => console.log(error));
    }

}
