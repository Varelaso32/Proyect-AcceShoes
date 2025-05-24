import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Correo {
  id: number;
  remitente: string;
  asunto: string;
  mensaje: string;
  respondido: boolean;
  respuesta?: string;
}

@Component({
  selector: 'app-gestion-contactenos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-contactenos.component.html',
  styleUrls: ['./gestion-contactenos.component.css'],
})
export class GestionContactenosComponent {
  correos: Correo[] = [
    {
      id: 1,
      remitente: 'juan@example.com',
      asunto: 'Problema con el registro',
      mensaje: 'No puedo registrarme en la plataforma.',
      respondido: false,
    },
    {
      id: 2,
      remitente: 'ana@example.com',
      asunto: 'Sugerencia',
      mensaje: 'Sería útil tener modo oscuro.',
      respondido: false,
    },
    {
      id: 3,
      remitente: 'carlos@example.com',
      asunto: 'Error en el pago',
      mensaje: 'Mi tarjeta fue rechazada al intentar pagar.',
      respondido: false,
    },
    {
      id: 4,
      remitente: 'laura@example.com',
      asunto: 'Felicitaciones',
      mensaje: 'Excelente plataforma, ¡felicidades al equipo!',
      respondido: false,
    },
    {
      id: 5,
      remitente: 'mario@example.com',
      asunto: 'Problema con restablecer contraseña',
      mensaje: 'No me llega el correo para restablecer mi clave.',
      respondido: false,
    },
    {
      id: 6,
      remitente: 'luisa@example.com',
      asunto: 'Consulta sobre privacidad',
      mensaje: '¿Cómo se manejan mis datos personales?',
      respondido: false,
    },
    {
      id: 7,
      remitente: 'pedro@example.com',
      asunto: 'Problema visual',
      mensaje: 'El botón de enviar no se ve en mi celular.',
      respondido: false,
    },
    {
      id: 8,
      remitente: 'valentina@example.com',
      asunto: 'Cuenta bloqueada',
      mensaje: 'Intenté iniciar sesión varias veces y me bloqueó.',
      respondido: false,
    },
    {
      id: 9,
      remitente: 'andres@example.com',
      asunto: 'Error 404',
      mensaje: 'Intento entrar a una sección y me da error 404.',
      respondido: false,
    },
    {
      id: 10,
      remitente: 'carolina@example.com',
      asunto: 'Actualización de datos',
      mensaje: 'No encuentro dónde cambiar mi número de teléfono.',
      respondido: false,
    },
  ];

  correoSeleccionado: Correo | null = null;
  respuesta = '';

  seleccionarCorreo(correo: Correo) {
    this.correoSeleccionado = correo;
    this.respuesta = correo.respuesta || '';
  }

  cerrarModal() {
    this.correoSeleccionado = null;
    this.respuesta = '';
  }

  enviarRespuesta() {
    if (this.correoSeleccionado) {
      this.correoSeleccionado.respondido = true;
      this.correoSeleccionado.respuesta = this.respuesta;

      Swal.fire({
        icon: 'success',
        title: 'Respuesta enviada',
        text: 'El mensaje ha sido marcado como respondido.',
        confirmButtonColor: '#06b6d4', // cyan
      });

      this.correoSeleccionado = null;
      this.respuesta = '';
    }
  }

  eliminarCorreo(correo: Correo) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este mensaje se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // red
      cancelButtonColor: '#9ca3af', // gray
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.correos = this.correos.filter((c) => c.id !== correo.id);
        if (this.correoSeleccionado?.id === correo.id) {
          this.correoSeleccionado = null;
          this.respuesta = '';
        }

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El mensaje ha sido eliminado.',
          confirmButtonColor: '#06b6d4',
        });
      }
    });
  }
}
