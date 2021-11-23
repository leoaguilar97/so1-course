package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

func PRODUCTOR(flujo DatosDeFlujo) (mensajes []*Mensaje) {
	var wg sync.WaitGroup
	var salir int32
	salir = 0

	for {
		wg.Add(1)
		go func() {
			defer wg.Done()

			mensaje, err := flujo.Siguiente()

			if err == finalDeDatos {
				println("sal
				iendo!")
				atomic.AddInt32(&salir, 1)
				return
			}
			println("asdf")
			mensajes = append(mensajes, mensaje)
		}()

		if salir == 1 {
			break
		}
	}

	wg.Wait()

	return mensajes
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
