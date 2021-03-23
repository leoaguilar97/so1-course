package main

import (
	"fmt"
	"math/rand"
	"runtime"
	"sync"
	"sync/atomic"
	"time"
)

/***************/
func Add(numbers []int) int64 {
	var sum int64
	for _, n := range numbers {
		sum += int64(n)
	}

	return sum
}

func AddConcurrentVerbose(numbers []int) int64 {

	numOfCores := runtime.NumCPU()
	fmt.Printf("Numero de Cores: %d\n", numOfCores)
	runtime.GOMAXPROCS(numOfCores)

	var sum int64
	max := len(numbers)
	fmt.Printf("Cantidad de numeros: %d\n", max)

	sizeOfParts := max / numOfCores
	fmt.Printf("Numero de partes: %d\n", sizeOfParts)

	var wg sync.WaitGroup
	for i := 0; i < numOfCores; i++ {
		start := i * sizeOfParts
		end := start + sizeOfParts
		part := numbers[start:end]
		fmt.Printf("Inicio: %d, Fin: %d, Parte: %v\n", start, end, part)
		wg.Add(1)
		go func(nums []int) {
			fmt.Printf("Realizando Suma de la parte %v\n", nums)
			defer wg.Done()
			var partSum int64
			for _, n := range nums {
				partSum += int64(n)
			}
			fmt.Printf("Suma de la parte: %d\n", partSum)
			atomic.AddInt64(&sum, partSum)
		}(part)
	}

	fmt.Printf("Iniciando espera de procesos\n")
	wg.Wait()
	fmt.Printf("Espera finalizada\n")
	return sum
}

func AddConcurrent(numbers []int) int64 {

	numOfCores := runtime.NumCPU()
	runtime.GOMAXPROCS(4)

	var sum int64
	max := len(numbers)

	sizeOfParts := max / numOfCores

	var wg sync.WaitGroup

	// GoRutinas diferentes
	for i := 0; i < numOfCores; i++ {
		start := i * sizeOfParts
		end := start + sizeOfParts
		part := numbers[start:end]

		wg.Add(1)
		go func(nums []int) {
			defer wg.Done()

			var partSum int64

			for _, n := range nums {
				partSum += int64(n)
			}

			atomic.AddInt64(&sum, partSum)
		}(part)
	}

	wg.Wait()

	return sum
}

func crearHilo(valor int) {
	fmt.Println("Inicio mensaje en el hilo: \t", valor)
	time.Sleep(200 * time.Millisecond)
	fmt.Println("Segundo mensaje en el hilo: \t", valor)
	time.Sleep(200 * time.Millisecond)
	fmt.Println("Tercer mensaje en el hilo: \t", valor)
}

func probarHilos() {
	fmt.Println("Inicio de la prueba de hilos")
	for i := 0; i < 10; i++ {
		go crearHilo(i)
	}

	time.Sleep(5 * time.Second)
	fmt.Println("Final de la prueba")
}

func main() {

	fmt.Println("********* INICIO PRUEBA DE HILOS **********")
	probarHilos()

	fmt.Println("********* INICIO PRUEBA DE SUMAS **********")

	rand.Seed(time.Now().Unix())
	numbers := rand.Perm(12)

	fmt.Printf("Array: %d\nIniciando Sumas\n", numbers)

	t := time.Now()
	sum := Add(numbers)
	fmt.Printf("Suma secuencial, Sum: %d, Tiempo tomado: %s\n", sum, time.Since(t))

	t = time.Now()
	sum = AddConcurrent(numbers)
	fmt.Printf("Suma concurrente, Suma: %d, Tiempo tomado: %s\n", sum, time.Since(t))

	fmt.Print("\n\n****** Iniciando Explicación *******\n\n")
	t = time.Now()
	fmt.Print("Array: ", numbers, "\n")
	sum = AddConcurrentVerbose(numbers)

	fmt.Print("\n\n*********** Suma de Un Millon de Registros *********\n\n")
	numbers = rand.Perm(1e6)
	t = time.Now()
	sum = Add(numbers)
	fmt.Printf("Suma secuencial, Sum: %d, Tiempo tomado: %s\n", sum, time.Since(t))

	t = time.Now()
	sum = AddConcurrent(numbers)
	fmt.Printf("Suma concurrente, Suma: %d, Tiempo tomado: %s\n", sum, time.Since(t))

}
