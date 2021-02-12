#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Leonel Aguilar");
MODULE_DESCRIPTION("Hello-world kernel style!");
MODULE_VERSION("1.0.0");

static int __init kernel_module_init_event(void)
{
    printk(KERN_INFO "Hola mundo! SOPES 1");
    return 0;
}

static void __exit kernel_module_exit_event(void)
{
    printk(KERN_INFO "Adios mundo :(");
}

module_init(kernel_module_init_event);
module_exit(kernel_module_exit_event);