#include <linux/module.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <linux/sched.h>
#include <linux/uaccess.h>
#include <linux/fs.h>
#include <linux/sysinfo.h>
#include <linux/seq_file.h>
#include <linux/slab.h>
#include <linux/mm.h>
#include <linux/swap.h>
#include <linux/timekeeping.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Leonel Aguilar - Sebastian Sanchez");
MODULE_DESCRIPTION("Modulo que muestra la hora del sistema");
MODULE_VERSION("0.01");

static int my_proc_show(struct seq_file *m, void *v)
{
    /*
    ¿Qué hace 'ktime_get_real_seconds'?

    Return a coarse-grained version of the time as a scalar time64_t. 
    This avoids accessing the clock hardware and rounds down the seconds
    to the full seconds of the last timer tick using the respective 
    reference.

    Referencia:

    https://www.kernel.org/doc/html/latest/core-api/timekeeping.html#c.ktime_get_real_seconds
    */
    unsigned long current_time = ktime_get_real_seconds(); // Segundos transcurridos desde 1970

    /*

    If variable is of Type,		use printk format specifier:
	------------------------------------------------------------
		int			            %d or %x
		unsigned int		    %u or %x
		long			        %ld or %lx
		unsigned long		    %lu or %lx
		long long		        %lld or %llx
		unsigned long long	    %llu or %llx
		size_t			        %zu or %zx
		ssize_t			        %zd or %zx
		s32			            %d or %x
        u32			            %u or %x
		s64			            %lld or %llx
		u64			            %llu or %llx
    
    Información adicional de PrintK Y seq_printf
    https://www.kernel.org/doc/Documentation/printk-formats.txt

    */
    int seconds, minutes, hours;

    seconds = (current_time % 60);      // Obtener segundos en la hora actual
    minutes = (current_time / 60) % 60; // Obtener minutos en la hora actual
    hours = (current_time / 3600) % 24; // Obtener horas en tiempo actual

    seq_printf(m, "%d:%d:%d", hours, minutes, seconds);

    return 0;
}

static ssize_t my_proc_write(struct file *file, const char __user *buffer, size_t count, loff_t *f_pos)
{
    return 0;
}

static int my_proc_open(struct inode *inode, struct file *file)
{
    return single_open(file, my_proc_show, NULL);
}

static struct file_operations my_fops = {
    .owner = THIS_MODULE,
    .open = my_proc_open,
    .release = single_release,
    .read = seq_read,
    .llseek = seq_lseek,
    .write = my_proc_write};

static int __init test_init(void)
{
    struct proc_dir_entry *entry;
    entry = proc_create("timestamps", 0777, NULL, &my_fops);
    if (!entry)
    {
        return -1;
    }
    else
    {
        printk(KERN_INFO "@timestamps-module iniciado\n");
    }
    return 0;
}

static void __exit test_exit(void)
{
    remove_proc_entry("timestamps", NULL);
    printk(KERN_INFO "@timestamps-module finalizado\n");
}

module_init(test_init);
module_exit(test_exit);