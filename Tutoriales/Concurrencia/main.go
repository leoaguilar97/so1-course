package main

import (
	"fmt"
	"math/rand"
	"runtime"
	"sync"
	"sync/atomic"
	"time"
)

func Sumar(numeros []int) int64 {
	var sum int64
	for _, n := range numeros {
		sum += int64(n)
	}

	return sum
}

func SumarConcurrente(numeros []int) int64 {

	cores := 5 //runtime.NumCPU() // yo tengo 12 nucleos
	runtime.GOMAXPROCS(4)

	var sum int64
	max := len(numeros)

	partes := max / cores // 843,333.333 12 -> 1, 24 -> 2 , 36 -> 3

	var wg sync.WaitGroup

	for i := 0; i < cores; i++ {
		inicio := i * partes
		fin := inicio + partes
		parte := numeros[inicio:fin] // 24 [0,1,2,3] -> [0,1], [2,3]...

		wg.Add(1)
		go func(nums []int) {
			defer wg.Done()

			var suma_de_la_parte int64
			for _, n := range nums {
				suma_de_la_parte += int64(n)
			}

			atomic.AddInt64(&sum, suma_de_la_parte)
		}(parte)
	}

	wg.Wait()
	return sum
}

func crearHilo(identificador int) {
	fmt.Println("Hola mundo! Soy el Hilo #", identificador)
}

func llamarHilos() {
	for i := 0; i < 10; i++ {
		go crearHilo(i)
	}
}

func main() {
	numeros := rand.Perm(1e8) //100000

	fmt.Printf("Sumando: %v\n", numeros)

	t := time.Now()
	sum := Sumar(numeros)
	fmt.Printf("Suma: %d Tiempo: %s", sum, time.Since(t))

	t = time.Now()
	sum = SumarConcurrente(numeros)
	fmt.Printf("Suma Concurrente: %d Tiempo: %s", sum, time.Since(t))
}
