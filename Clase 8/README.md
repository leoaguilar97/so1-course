# PROCESOS

Los procesos son una de las abstracciones más antiguas e importantes que proporcionan los sistemas operativos.

La importancia radica en que proporcionan la capacidad de operar concurrentemente, incluso cuando solo hay una CPU disponible (o sea, convierten una CPU en varias CPU virtuales).

**Esto es tan importante ya que sin la abstracción de los procesos la computación moderna no podría existir.**

Todas las computadoras modernas ofrecen varias cosas al mismo tiempo y muchas veces cuando trabajamos en ellas no estamos totalmente conscientes de este hecho. Cuando se arranca el sistema se inician muchos procesos en forma secreta.

Por ejemplo, se podría iniciar un proceso para esperar los correos entrantes, otro que permite al antivirus analizar la computadora y actualizarse; esto se puede hacer mientras nosotros como usuarios utilizamos la computadora.

Toda esta actividad se tiene que administrar, y en este caso un sistema de multiprogramación con soporte de múltiples procesos es muy útil.

En este modelo, todo el software ejecutable en la computadora se organiza en procesos secuenciales. Un proceso es la instancia de un programa en ejecución, incluyendo los valores actuales del contador del programa, los registros y las variables.

En cualquier sistema de multiprogramación, la CPU cambia de un proceso a otro con rapidez ejecutando cada uno durante décimas o centésimas de milisegundos: si hablamos en un sentido estricto en un cualquier instante la CPU está ejecutando sólo un proceso, y en el transcurso de un segundo podría ejecutar varios de ellos, dando la apariencia de paralelismo.

Cuando decimos que una CPU puede ejecutar sólo un proceso a la vez, si hay dos núcleos (o CPUs) cada uno de ellos puede ejecutar un proceso a la vez.

Les voy a presentar una analogía: un científico computacional con mente culinaria hornea un pastel de cumpleaños para su hija; tiene la receta para un pastel de cumpleaños y una cocina bien equipada con todos los ingredientes: harina, huevos, azúcar, etcétera.

En esta analogía, la receta es el programa (es decir, un algoritmo expresado en cierta notación), el científico computacional es el procesador (CPU) y los ingredientes del pastel son los datos de entrada.

El proceso es la actividad que consiste en que nuestro cocinero vaya leyendo la receta, obteniendo los ingredientes y horneando el pastel.

Ahora imaginen que el hijo del científico entra corriendo y gritando se cortó el dedo. El científico computacional registra el punto de la receta en el que estaba (el estado del proceso en curso se guarda), saca un libro de primeros auxilios y empieza a seguir las instrucciones que contiene.

Aquí el procesador conmuta de un proceso (hornear el pastel) a uno de mayor prioridad (administrar cuidados médicos), cada uno de los cuales tiene un programa distinto (la receta y el libro de primeros auxilios).

Cuando ya se ha ocupado de la lesión, el científico computacional regresa a su pastel y continúa en el punto en el que se había quedado. La idea clave es que un proceso es una actividad de cierto tipo: tiene un programa, una entrada, una salida y un estado.

Cuando se arranca un sistema operativo se crean varios procesos, algunos se les llama de primer plano que son los que interactúan con nosotros los usuarios y realizan trabajos para nosotros. Otros procesos en segundo plano, que no están asociados con usuarios sino que están asociados con una función específica. A estos procesos en segundo plano se les conoce como demonios (daemons) y los sistemas operativos tienen un montón.

En algunos sistemas, cuando un proceso crea otro, el proceso padre y el proceso hijo continúan asociados en ciertas formas. El proceso hijo puede crear por sí mismo más procesos, formando así una jerarquía, algo que podría verse como un arbolito.

En los sistemas operativos UNIX o basados en UNIX como Linux, un proceso y todos sus hijos, con sus posteriores descendientes, forman un grupo de procesos. Windows un concepto de jerarquía de procesos, aquí todos los procesos son iguales. Lo único parecido es que cuando se crea un procesos, el padre recibe un indicador especial, que es un token llamado manejador que puede usar para controlar al hijo, pero no tiene la libertad de pasar este indicador a otros procesos con lo cual invalida la jerarquía.

# Estados

Aunque cada proceso es una entidad independiente, con su propio contador de programa y estado interno, a menudo los procesos necesitan interactuar con otros. Un proceso puede generar ciertas salida que otro proceso utiliza como entrada. Hay tres estados que vamos a tomar en cuenta:

- **En ejecución:** Es cuando el proceso está usando el CPU en ese instante de tiempo.
- **Listo:** El proceso está detenido temporalmente para dejar que se ejecute otro proceso.
- **Bloqueado:** No puede ejecutarse sino hasta que ocurra cierto evento externo.

Las transiciones 2 y 3 son producidas por el planificador de procesos. La 2 sucede cuando el planificador decide que el proceso en ejecución se ha ejecutado el tiempo suficiente y es momento de dejar que otro proceso tenga una parte del tiempo de la CPU.

La transición 3 ocurre cuando todos los demás procesos han tenido su parte del tiempo de la CPU y es momento de que el primer proceso obtenga la CPU para ejecutarse de nuevo.

La transición 4 ocurre cuando se produce el evento externo por el que un proceso estaba esperando. Si no hay otro proceso ejecutándose se activa la transición 3 y empieza a ejecutarse.

## IMPLEMENTACIÓN DE PROCESOS

Para implementar el modelo de procesos, el sistema operativo mantiene una tabla (algo así como un arreglo de estructuras) llamada _tabla de procesos_, con sólo una entrada por cada proceso.

Esta entrada contiene información importante acerca del estado del proceso, incluyendo su contador de programa, apuntador de pila, asignación de memoria, estado de sus archivos abiertos y todo lo demás que debe guardarse acerca del proceso cuando éste cambia del estado en ejecución a listo o bloqueado, de manera que se pueda reiniciar posteriormente como si nunca se hubiera detenido.

# HILOS

En los sistemas operativos tradicionales, cada proceso tiene un espacio de direcciones y solo un hilo de control. De hecho, ésa es casi la definición de un proceso. A veces hay situaciones en las que es conveniente tener varios hilos de control en el mismo espacio de direcciones que se ejecutan en cuasi-paralelo, como si fueran procesos separados, excepto que estos comparten el mismo espacio de direcciones.

La principal razón de tener hilos, y de su existencia, es que en muchas aplicaciones se desarrollan varias actividades a la vez. Algunas de esas actividades se pueden bloquear de vez en cuando y al hacerlo desde un punto de vista más concurrente se simplifican muchas cosas.

Precisamente esta también es la justificación de tener procesos. En vez de pensar en interrupciones, temporizadores pensamos en procesos "paralelos". Ahora con los hilos agregamos un nuevo elemento: la capacidad de compartir el mismo espacio de direcciones y todos sus datos entre ellas. Un segundo argumento para tener hilos es que, como son más ligeros que los procesos, son más fáciles de crear y destruir. También son útiles en los sistemas donde hay verdadero paralelismo.

# CONCURRENCIA Y PARALELISMO

Concurrencia es ejecutar varios procesos en el mismo tiempo, pero en un único CPU. Al ejecutarse concurrentemente se multiplexan los procesos en el CPU.

Paralelismo es ejecutar varios procesos en el mismo tiempo en distintos CPUs. Al ejecutarse paralelamente cada CPU es encargado de ejecutar su CPU.

# MODELO DE PROCESOS

Lo que agregan los hilos al modelo de procesos es permitir que se lleven varias ejecuciones en el mismo entorno del procesos, que son en gran parte independientes unas de las otras.

Tener varios hilos ejecutándose en paralelo en un procesos es algo similar a tener varios procesos ejecutándose en paralelo en una computadora. Los hilos comparten un espacio de direcciones y recursos del proceso; los procesos comparten la memoria física, los discos y otros recursos del sistema.
