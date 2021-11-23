//
// Este es archivo que deben modificar para arreglarlo!
//

package main

import (
	"fmt"
	"time"
)

func PRODUCTOR(flujo DatosDeFlujo) (mensajes []*Mensaje) {
	for {
		mensaje, err := flujo.Siguiente()
		if err == finalDeDatos {
			return mensajes
		}

		mensajes = append(mensajes, mensaje)
	}
}

func CONSUMIDOR(mensajes []*Mensaje) {
	for _, mensaje := range mensajes {
		if mensaje.HablandoDeRickYMorty() {
			fmt.Println(mensaje.Nombre, "\testa hablando de Rick y Morty!")
		} else {
			fmt.Println(mensaje.Nombre, "\tno es cool :(")
		}
	}
}

func main() {
	inicio := time.Now()
	flujo := RealizarFlujo()
	mensajes := PRODUCTOR(flujo)
	CONSUMIDOR(mensajes)
	fmt.Printf("El proceso tomo: %s\n", time.Since(inicio))
}
