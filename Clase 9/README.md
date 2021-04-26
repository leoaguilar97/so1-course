# Scheduler

El scheduler es una tarea que está ejecutándose en el sistema operativo que permite planificación la ejecución de los procesos, y cambiar su estado; recordemos que los estados comunes son: listo, esperando, ejecutándose, zombie, y durmiendo.

El CPU utiliza la planificación de procesos para ser más eficiente.

Por ejemplo, para los sistemas operativos UNIX, la política de planificación indica que el algoritmo debe satisfacer varios objetivos, el tiempo de respuesat debe ser adecuado; debe tener un buen rendiminto, debe permitirse trabajos en segundo plano, evitar innanición de procesos (procesos en busca de recursos que no pueden tener), reconciliar las necesidades de procesos de alta y baja prioridad, etc.

Existen varios algoritmos de planificación:

- First Come First Serve
- Shortest Job-First (SJF)
- Shortest Remaining Time
- Priority Scheduling
- Round Robin Scheduling - RRS
- Multilevel Queue Shcheduling

En las versiones anteriores de Linux se utilizaba una planificación por prioridad; a cada cambio de proceso el kernel revisaba la lista de procesos ejecutables, computaba sus prioridades y seleccionaba el mejor proceso para correr. Uno de los problemas con esto es que el algoritmo debe invertir mucho tiempo en decidir cuál proceso ejecutar, es costoso y depende de la cantidad de procesos que tengamos.

El algoritmo para los nuevos sistemas operativos Linux es mucho más sofisticado, escala muy bien con el número de procesos ejecutables, el O(n) del algoritmo es constante. Cada proceso de linux es planificado utilizando una mezcla de First Come First Serve y Round Robin.

## Preemption

El término "preemption" (traducido a español, significa "con derecho preferente"). Este acto básicamente es interrumpir un proceso en ejecución y dejarlo en "espera" para volver a ejecutarlo en otro momento.

Esta interrupción es hecha por el scheduler; y es considerada como una interrupción segura. Este cambio de proceso en ejecución se le denomina "context switching" (cambio de contexto).

El momento en el que el scheduler hará esta acción es no-determinista para el programador, por lo cual no se debe programar teniendo en cuenta esto.

Existen los non-preemtive schedulers, nunca realizan interrupciones a los procesos; generalmente los de prioridad, el scheduler Round Robin también es un ejemplo de un planificador non-preemptive.

# HILOS

Como comentábamos en la clase de procesos, un proceso es una instancia de un programa en ejecución.

Cada proceso puede tener uno o más hilos; un proceso por fuerza debe tener al menos un hilo que se denomina "main-thread".

La concurrencia son dos procesos (o dos hilos) ejecutándose en el mismo espacio de tiempo (cada uno compartiendo recursos como la memoria). Y el paralelismo es cuando los procesos se ejecutan exactamente al mismo tiempo (únicamente concebible a través de dos o más núcleos).

El problema está cuando necesitamos que los dos procesos compartan recursos o se comuniquen entre sí, comunmente a través de variables o parámetros. A veces necesitamos que la salida de un proceso sea la entrada del otro.

Pensemos en nuestro ejemplo del cocinero que hacía un pastel, e imaginemos que ahora estamos en un evento familiar, en un churrasco. Mientras el cocinero está realizando la carne, muy probablemente estemos también quitando los pedazos que están cocinados, cambiándolos de lado, etc.

Podríamos abstraer este problema al siguiente código:

```Java

class Churrascon {

    // Al inicio del churrasco, teníamos 0 pedazos cocinados.
    int pedazos_que_quedan = 0;

    int asar (){
        int id_del_pedazo = churrasquera.ponerUnPedazo(new PedazoDeCarnita());
        pedazos_que_quedan = pedazos_que_quedan + 1;

        // Retorno el id para saber cuál estoy volteando
        return id_del_pedazo;
    }

    void quitar(){
        churrasquera.quitarUnPedazo();
        pedazos_que_quedan = pedazos_que_quedan - 1;
    }

    void voltear(int id_del_pedazo){
        churrasquera.voltearPedazo(id_del_pedazo);
    }

    public static void main(String args[]){
        Churrascon churrascon = new Churrascon();

        // Este hilo servirá para estar cocinando pedazos de carne
        Thread cocinar_pedazos = new Thread(){
            @Override
            void Run(){
                int id_del_pedazo = churrascon.asar();
                // me tardo 8 minutos por lado
                Thread.sleep(480000);
                churrascon.voltear(id_del_pedazo);
                // me tardo 8 minutos por lado
                Thread.sleep(480000);
            }
        };

        // Este hilo servirá para estar quitando los pedazos de carne
        Thread quitar_pedazos_cocinados = new Thread(){
            @Override
            void Run(){
                // Ya que me tardo 8 minutos por lado, me tardaré 16 cocinando
                Thread.sleep(960000);
                // Quito el primero de la cola
                churrascon.quitar();
            }
        };

        cocinar_pedazos.start();
        quitar_pedazos_cocinados();
    }
}
```

Ahora bien este problema se ve bastante sencillo, es más, la implementación fue muy fácil. Sin embargo el problema no está resuelto.

Como veremos, el problema está en no saber exactamente cuándo se calendarizará la ejecución de los procesos; esto llevará a incongruencias en los datos que esperamos. Incluso después de la primera vez que se ejecuten los dos hilos, es igual de probable que quede 1 pedazo de carne, 0 pedazos, ¡o -1!

Múltiples problemas de esta misma índole ocurrieron a lo largo de una buena temporada donde la concurrencia iniciaba a ser un término del día a día en la programación.

Para solucionar este problema fue necesario desarrollar toda una teoría que indica cómo y de qué maneras dos o más procesos pueden comunicarse entre sí. Por ejemplo, el problema de los filósofos comensales. Fue propuesto por Edsger Dijkstra en 1965, y sirvió para demostrar los problemas que existían al compartir recursos entre los procesos.

Existen cinco filósofos sentados en una mesa; y básicamente los filósofos invierten su tiempo pensando, luego comen y por último duermen.

Cada filósofo tiene un plato de comida exclusivo, para poder comer requieren de dos tenedores, en la mesa existen 5 tenedores los cuales deben compartir con el filósofo que está a su derecha e izquierda. Y como podrán haber intuído, todo el problema recae en este preciso detalle.

Para poder comer se necesita que ambos tenedores estén disponibles, si uno no está disponible no se pueden tomar los tenedores y por ende no podremos comer.

Ahora bien podríamos solucionar esto dándole de comer a cada uno de los filósofos secuencialmente; ¿Pero qué pasará cuando en nuestra mesa tengamos 10 filósofos? ¿100 filósofos? Ahora definitivamente no existen mesas tan grandes; el problema es puramente teórico, pero en una idea tan sencilla recae mucha teoría que ayudó a fundamentar las bases de la programación concurrente.

Si dos filósofos que estén sentados a la par intentan tomar el mismo tenedor a la vez se produce lo denominado condición de carrera; ambos filósofos competirán por los recursos y solamente el primero lo tendrá, el otro quedará sin comer.

Si todos toman, por ejemplo, el tenedor que está a su derecha, _todos_ morirán de hambre esperando a que el otro baje su tenedor para poder utilizarlo. A este comportamiento se le llama _dead lock_.

El problema consiste en determinar un algoritmo que permita que los filósofos no mueran de hambre, y que puedan comer todos de manera equitativa y sin necesidad de esperar _tanto_ tiempo.

También está el problema denominado "barbero dormilón", donde existe una barbería con un espacio y cantidad limitada de clientes. Hay 3 barberos y 3 sillas de barbero, si un barbero está libre cuando un cliente llega entonces lo puede atender; cuando un cliente finaliza debe pasar a la caja de cobro y un cajero le cobra. El problema está en que únicamente pueden haber 3 personas trabajando al mismo tiempo; por lo cual cuando un cliente termina, el barbero que lo atendió debe quedarse "dormido" hasta que el cajero deje de atender.

Como podrán ver, quizá estos problemas no sean exactamente intuitivos pero si muy aplicables a la vida real, al utilizar procesos. Compartir recursos es una de las acciones fundamentales que realizan los procesos concurrentes y saber como realizar esta sincronización es un aspecto importante en la formación de cualquier desarrollador.

En los videojuegos es muy común ver este tipo de aplicaciones, hace poco en un curso me pidieron realizar un Space Invaders, y manejar los disparos junto con los aliens, el punteo del juego, y controles sin utilizar frameworks como Unity fue un desafío. Las colecciones en general no son concurrentes y llevaba a que _a veces_ funcionaba; otras veces fallaba, y otras veces no hacía nada.

Utilizar un buen manejo de sincronización entre procesos fue la clave.

La concurrencia puede ser complicada a veces, compartir memoria entre hilos crea mucha complejidad. El acceso concurrente a la memoria puede dar partida a condiciones de carrera, y por ello, dar un resultado no determinístico.

## Comunicación entre procesos

A esta comunicación se le denomina IPC (Inter-process comunication). IPC es un mecanismo que
permite a distintos procesos comunicarse entre sí, y también a sincronizar sus acciones.

Las sincronizaciones entre procesos reducen el paralelismo, y tienen limitaciones; sin embargo son necesarias para evitar estos problemas.

Básicamente dos procesos se "comunican" entre sí cuando acceden al mismo espacio de memoria. Existe un concepto muy importantes de la comunicación entre procesos; la denominada "Región Crítica".

## Región crítica

La región crítica de un proceso es el momento donde accede a la memoria compartida con otros procesos.

En el código concurrente existen dos partes, la región no crítica y la región crítica. Definitivamente pueden haber varias regiones críticas en un mismo algoritmo; sin embargo lo mejor es dejar lo menos posible estas regiones para que la sincronización no quite tanto tiempo de ejecución, y también para evitar errores.

Los procesos que están en su parte no-crítica no deben afectar la espera de los otros procesos.

Una parte muy importante de entender es que, debemos **garantizar** que no exista más de un proceso en su región crítica al mismo tiempo. A esta garantía le llamamos Exclusión Mútua.

## Resolviendo el problema

Para evitar los problemas que ocasiona el acceso a memoria compartida, y la sincronización de procesos, debemos asegurarnos de cumplir cuatro condiciones importantes:

- Garantizar la exclusión mútua: necesitamos una manera de asegurarnos que si un proceso está en su región crítica, no habrá otro proceso en la región crítica.

- Progreso: si un proceso no está en su región crítica no debe interponer con otro proceso para acceder a su región crítica. Básicamente, los procesos no deben tener una relación tóxica con su memoria compartida.

- No se puede realizar ninguna suposición acerca de la velocidad o del número de núcleos que tengamos a disposición.

- Bounded Waiting o Espera Limitada: Necesitamos una manera de asegurarnos que exista un límite de tiempo en el cual el proceso esté permitido a estar en su región crítica, antes que otro proceso lo esté también.

# Técnicas de sincronización

Existen numerosas técnicas para realizar la sincronización entre dos procesos, y con ello lograr los cuatro objetivos mencionados anteriormente.

## Deshabilitar las interrupciones

En un sistema con un solo procesador resulta muy tentador hacer que cada proceso deshabilite todas las interrupciones justo cuando entra a su región crítica, y las vuelva a habilitar al salir de ella. Con las interrupciones deshabilitadas no pueden ocurrir interrupciones de reloj y por lo tanto se tendrá un comportamiento "secuencial".

Cuando se desactivan las interrupciones no existe riesgo que otro proceso se ejecute en ese momento e intervenga.

Uno de los problemas con esta solución es que no funciona si tenemos varios núcleos, ya que las interrupciones solamente se inhabilitan en el CPU donde se ejecutó la instrucción.

## Locks

Imaginemos que estamos en un baño público (si, yo sé que no es un ejemplo tan común). Existe una persona afuera que indica cuándo podemos pasar y cuando está ocupado, por lo cual; nosotros, cuando llegamos debemos de preguntar si podemos pasar.

Si no podemos pasar, debemos quedarnos esperando a que sea nuestro turno. Cuando pasemos, el portero nos dará la llave para abrir la puerta, que la persona pasada dejó con él cuando salió.

De esta misma manera funciona las variables candados. Crearemos una variable candado y con esta definiremos si hay o no hay procesos en la región crítica. 0 significará que no hay procesos en la región crítica, y por lo tanto podemos entrar a ella. 1 significará que si hay un proceso en la región crítica, por lo que debemos esperar.

Imaginémonos los siguientes procesos:

```Java
// Proceso #1

int candado = 0;
int contador = 0;

void contarPaArriba {
    /*********************
    * REGIÓN NO-CRÍTICA  *
    **********************/

    // ...

    /*******************************
    * MECANISMO DE SINCRONIZACIÓN  *
    ********************************/
    while (candado == 1) {
        ;
    }
    candado = 1;

    /*********************
    * REGIÓN CRÍTICA     *
    **********************/
    contador++;


    /*********************
    * REGIÓN NO-CRÍTICA  *
    **********************/
    candado = 0;

    // ...
}


void contarPaAbajo {
    /*********************
    * REGIÓN NO-CRÍTICA  *
    **********************/

    // ...

    /*******************************
    * MECANISMO DE SINCRONIZACIÓN  *
    ********************************/
    while (candado == 1) {
        ;
    }
    candado = 1;

    /*********************
    * REGIÓN CRÍTICA     *
    **********************/
    contador--;


    /*********************
    * REGIÓN NO-CRÍTICA  *
    **********************/
    candado = 0;

    // ...
}
```

Analicemos nuestros cuatro criterios:

1. Exclusión Mútua: Es posible que en algún momento uno de los procesos se esté ejecutando y el candado sea 0; justo antes de poder cambiar el estado del candado a 1 otro proceso es planificado a ejecutarse; este se encuentra que candado también es 0 y lo define como 1; el proceso que se había parado vuelve a ejecutarse y cambia también el candado a 1. Esto provocaría que existan dos procesos al mismo tiempo en su región crítica, por lo cual no se garantiza la exclusión mútua.

2. Progreso: En efecto, ningun proceso puede parar la ejecución de otro proceso en su región crítica con el código que tenemos; una vez no toquemos la variable "candado" garantizaremos que no estamos afectando el progreso de la aplicación.

3. Asumpciones: No estamos asumiendo nada acerca del hardware.

4. Bounded Waiting: No cumplimos con este criterio tampoco, podría ser que un proceso se esté ejecutando siempre, imaginémonos el siguiente caso:

```Java
void contarPaArriba {
    while(true){

        while (candado == 1) {
            ;
        }
        candado = 1;

        /*********************
        * REGIÓN CRÍTICA     *
        **********************/
        contador++;

        /*********************
        * REGIÓN NO-CRÍTICA  *
        **********************/
        candado = 0;
        // ...
    }
}
```

Ahora ejecutaremos siempre el proceso uno, por lo cual podría ser que este proceso se ejecute y siempre pueda definir que "candado" es 1, por lo que el proceso 2 nunca podría llegar a ejecutarse.

Ahora bien, notemos que esto no es un dead-lock, ya que si hay un proceso corriendo, simplemente no estamos alternando los procesos que se están ejecutando, no existe un límite de tiempo que puede estar un proceso en su región crítica.

Como pudimos observar, este método no es eficaz para sincronizar dos o más procesos, cumple únicamente con dos de nuestros criterios; sin embargo esta es una de las bases de los demás algoritmos de sincronización.

## Alternancia Estricta

Este mecanismo de sincronización es aplicable únicamente cuando existen dos procesos. Se fundamentó en la idea de tomar turnos para ejecutarse. Utilizaremos una variable entera para definir en qué turno vamos, y esperaremos a que el otro proceso nos "permita" el turno.

Veamos un poco del código:

```Java

turno = 0;

void proceso1 {

    while(1){
        while(turno == 1);

        /*********************
        * REGIÓN CRÍTICA     *
        **********************/

        turno = 1;
    }
}

void proceso2 {

    while(1){
        while(turno == 0);

        /*********************
        * REGIÓN CRÍTICA     *
        **********************/

        turno = 0;
    }
}
```

Como podemos ver, en este caso estamos ejecutando dos procesos; al inicio se ejecuta el proceso 1, mientras que el proceso 2 está esperando a su turno.

Al terminar de ejecutar la región crítica, el proceso 1 pasa el turno al proceso 2; y se queda en espera del otro proceso.

Aunque esta podría ser una muy buena solución, existen algunos contra con ella, revisemos nuestros cuatro criterios:

1. Exclusión Mútua: En este caso, la exclusión mútua si se cumple. No hay forma en la que los dos procesos estén ejecutándose a la misma vez en su región crítica.

2. Progreso: En este caso, el criterio de progreso no se cumple. Imaginémonos que modificamos un poco el código del proceso 2:

```Java
void proceso2 {
    while(1){
        /*********************
        * REGIÓN NO-CRÍTICA  *
        **********************/

        while(turno == 0);

        /*********************
        * REGIÓN CRÍTICA     *
        **********************/

        turno = 0;
    }
}
```

Ahora el proceso 2 tiene una región no crítica. Imaginémonos que el turno en este caso es 1, entonces el proceso 2 debería poder ejecutarse. Justo cuando está iniciando a ejecutarse, el scheduler planifica ejecutar el proceso 1.

El proceso uno se verá afectado, la variable "turno" sigue siendo 1, y por lo tanto no podrá entrar a su región crítica, incluso si el proceso2 está en su región no-crítica.

Por ello, no se cumple esta condición.

3. Asumpciones: No estamos realizando ninguna asumpción acerca de la cantidad de cpus o de su velocidad.

4. Bounded Waiting: Si se cumple. No hay una forma de que un proceso entre a su región crítica dos veces seguidas con este mecanismo.

Si bien podríamos pensar que esta es una muy buena solución (y viendo nuestros criterios únicamente, sí lo es); no es un candidato serio. Este mecanismo nos hace esperar demasiado tiempo de ejecución, y por lo tanto no es recomendado.

## Solución de Peterson

El matemático holandés Theodorus Dekker fue el primero en idear una solución de software para el problema de la exclusión mútua, que no require alternancia estricta. Combinó la idea de tomar turnos y las variables de candado.

En 1981, Gary L. Peterson descubrió una manera mucho más simple de lograr exclusión mútua y gracias a esto la solución de Dekker fue considerada como obsoleta.

Antes de entrar a una región crítica, cada proceso debe llamar a una función denominada como entrar_a_región con su propio número de proceso como parámetro. Esta llamada hará que se espere si es necesario hasta que sea seguro entrar a la región.

Una vez haya terminado con al región crítica, se llama a salir_de_región para indicar que se ha terminado y permitir que los demás procesos entren si así lo necesitan. Este es el mejor mecanismo de sincronización para sincronizar dos procesos.

Veamos un poco acerca del código:

```Java

int[] ejecutandose = { false, false };
int turno;

void entrar(int pid){
    int otro = 1 - pid;
    ejecutandose[pid] = true;
    turno = pid;

    while(ejecutandose[otro] == true && turn == pid) {
        //esperar a que el otro proceso termine su turno...
        ;
    }
}

void salir(int pid){
    ejecutandose[pid] = false;
}

void process1 {
    entrar(1);

    /*********************
    * REGIÓN CRÍTICA     *
    **********************/

    salir(1);
}

void process2 {
    entrar(0);

    /*********************
    * REGIÓN CRÍTICA     *
    **********************/

    salir(0);
}
```

Debemos notar como estamos aprovechando el concepto del alcance de las variables globales y locales. La variable que controla el proceso que se está ejecutando, y el turno es global y por lo tanto su valor se comparte entre los procesos.

La variable "otro" está adentro de una función, que tiene un ámbito local y por lo tal su valor no será compartido entre procesos.

Evaluemos nuestros cuatro criterios.

1. Exclusión mútua: Si se cumple, esto debido a que estamos ingresando únicamente cuando garantizamos que estamos en el turno del proceso que necesitamos ejecutar.

2. Progreso: Para ninguno de los valores posibles de "ejecutandose" se tiene una condición que bloquee al otro proceso a bloquearse.

3. Asumpciones: No se realizó ninguna asumpción acerca de la cantidad de cpus o de la velocidad.

4. Espera limitada: Si se cumple, Ya que estamos saliéndonos y cambiando el valor de "ejecutándose", se cambia el valor del proceso que se está ejecutando a falso, y por lo tanto se permite al otro proceso ejecutarse.

## Dormir y despertar

La solución de Peterson es correcta, sin embargo se tiene el defecto de requerir la espera ocupada y desperdiciar tiempo de ejecución del CPU.

En lugar de desperdiciar este tiempo se utiliza el concepto de comunicación entre procesos. Una de las más simples es Sleep y Wakeup.

### Sleep

Es una llamada al sistema que cambia el estado del proceso a dormido, por lo tanto se desactiva hasta que otro proceso lo "despierte".

### Wakeup

La llamada wakeup tiene como parámetro el proceso que se activará. Esta función básicamente despierta a un proceso enviandole su pid.

# Problema del Productor-Consumidor

Dos procesos comparten un almacenamiento común de tamaño fijo. Uno de ellos, el productor, coloca productos en el almacenamiento y el otro, el consumidor los saca.

El problema surge cuando el productor desea colocar un nuevo producto en el almacén pero este ya está lleno.

La solución es que el productor se vaya a dormir una vez ingresó todos los productos que caben en el amacén, y el consumidor lo despertará una vez ya no hayan más productos en él.

De manera similar si el consumidor desea quitar un elemento del almacén y ve que se encuentra vacío se duerme hasta que el productor coloca algo en él y lo despierte.

Podemos abstraer este problema en el siguiente código:

```Java
int productosEnAlmacen = 0;

void productor() {
    while (true) {
        producto = crearUnProducto();

        // Nuestro búfer es de tamaño 10
        if (productosEnAlmacen == 10) {
            sleep();
        }

        guardarEnAlmacen(producto);
        productosEnAlmacen = productosEnAlmacen + 1;

        if (productosEnAlmacen == 1) {
            wakeup(consumidor);
        }
    }
}

void consumidor() {
    while (true) {

        if (productosEnAlmacen == 0) {
            sleep();
        }

        agarrarProducto();
        productosEnAlmacen = productosEnAlmacen - 1;

        if (productosEnAlmacen == 9) {
            wakeup(productor);
        }
    }
}
```

Es posible que suceda algo como el siguiente caso:

Al inicio no hay paquetes, el consumidor lee la variable "cuenta" que en este momento tiene 0 elementos. Antes de poder ir a dormirse, es interrumpido por el productor.

El productor empieza a llenar el búfer de productos. Como este estaba vacío al inicio, intenta despertar al consumidor, pero este ya está despierto; y la llamada se pierde para siempre.

Ahora, es el turno del consumidor, que desafortunadamente pasará a dormirse para siempre, ya que nunca será despertado.

Tarde o temprano el productor llenará el búffer de datos, con lo cual también se irá a dormir para siempre.

Con esto se generó un dead-lock, donde ninguno de los procesos despertará más.

## Semáforos

Con este problema en la mente, Dijkstra sugirió el uso de una variable entera para contar el número de señales de despertar, y guardarlas para utilizarlas después. En la propuesta introdujo un nuevo tipo de variable, que denominó "semáforo".

Un semáforo puede tener el valor de 0, indicando que no se han guardado señales de despertar, o algún valor positivo si estuviesen pendientes una o más señales.

Además necesitamos dos operaciones, down y up.

La operación down en un semáforo comprueba si el valor es mayor que 0, si es así, disminuye el valor y solo continúa, esto quiere decir que hay una señal de despertar almacenada.

Si el valor es 0, se pone a dormir sin completar la operación down por el momento.

Estas acciones de comprobar el valor, modificarlo y posiblemente pasar a dormir se realizan en conjunto como una sola acción atómica, así se garantiza que una vez que empiezaa una operación de semáforo ningún otro proceso puede acceder al semáforo hasta que esta operación se haya completado o bloqueado.

La operación up incrementa el valor del semáforo, si uno o más procesos estaban inactivos en el semáforo, sin poder completar una operación down anterior, el sistema selecciona uno de ellos al azár y les da oportunidad de complementar su acción down.

Despues de una operación up en un semáforo que contenga procesos dormids, el semáforo seguirá en 0 pero habrá un proceso menos dormido en él.

Veamos la solución de este problema utilizando semáforos:

```Java
Semaforo productosEnAlmacen = 0;
Semaforo espaciosLibres = 10;

void productor() {
    while (true) {
        producto = crearUnProducto();
        down(espaciosLibres);
            guardarEnAlmacen(producto);
        up(productosEnAlmacen);
    }
}

void consumidor() {
    while (true) {
        down(productosEnAlmacen);
        agarrarProducto();
        up(espaciosLibres);
    }
}
```
