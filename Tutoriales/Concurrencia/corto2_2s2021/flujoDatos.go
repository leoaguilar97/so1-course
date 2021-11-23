// NO EDITEN ESTA PARTE
// Lo único necesario es modificar "main.go"
// Este modulo envia un flujo de datos!

package main

import (
	"errors"
	"strings"
	"time"
)

func RealizarFlujo() DatosDeFlujo {
	return DatosDeFlujo{0, datos}
}

type Mensaje struct {
	Nombre string
	Texto  string
}

type DatosDeFlujo struct {
	pos      int
	mensajes []Mensaje
}

var finalDeDatos = errors.New("Final")

func (dato *DatosDeFlujo) Siguiente() (*Mensaje, error) {

	time.Sleep(400 * time.Millisecond)
	if dato.pos >= len(dato.mensajes) {
		return &Mensaje{}, finalDeDatos
	}

	mensaje := dato.mensajes[dato.pos]
	dato.pos++

	return &mensaje, nil
}

func (mensaje *Mensaje) HablandoDeRickYMorty() bool {
	time.Sleep(200 * time.Millisecond)
	return strings.Contains(strings.ToLower(mensaje.Texto), "rick") ||
		strings.Contains(strings.ToLower(mensaje.Texto), "morty")
}

var datos = []Mensaje{
	{
		"Leo",
		"#rickymorty: Es la mejor serie!",
	}, {
		"Jerry",
		"#rick: El personaje de rick se mira muy complejo",
	}, {
		"Summer",
		"No me gustó el primer capítulo :(",
	}, {
		"Beth",
		"Es una serie muy bonita y familiar. #RickYMorty",
	}, {
		"BP",
		"Wubba lubba dub dub! #rick",
	}, {
		"Morty",
		"El universo es muy grande para preocuparse por algo tan pequeno",
	}, {
		"Rick",
		"Ni lo entiendo, ni necesito entendero. #Morty",
	},
}
