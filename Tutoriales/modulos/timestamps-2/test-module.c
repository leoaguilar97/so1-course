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

static int my_proc_show(struct seq_file *m, void *v){
	unsigned long get_time;
    int sec, hr, min, tmp1, tmp2;
  
    
    get_time = ktime_get_real_seconds();

    sec = get_time % 60;
    tmp1 = get_time / 60;
    min = tmp1 % 60;
    tmp2 = tmp1 / 60;
    hr = (tmp2 % 24);

    seq_printf(m, "<h1> Hora  %d:%d:%d </h1>",hr, min, sec);
   
    return 0;
}

static ssize_t my_proc_write(struct file* file, const char __user *buffer, size_t count, loff_t *f_pos){
    return 0;
}

static int my_proc_open(struct inode *inode, struct file *file){
	return single_open(file, my_proc_show, NULL);
}

static struct file_operations my_fops={
	.owner = THIS_MODULE,
	.open = my_proc_open,
	.release = single_release,
	.read = seq_read,
	.llseek = seq_lseek,
	.write = my_proc_write
};

static int __init test_init(void){
	struct proc_dir_entry *entry;
	entry = proc_create("test-module", 0777, NULL, &my_fops);
	if(!entry) {
		return -1;	
	} else {
		printk(KERN_INFO "Inicio\n");
	}
	return 0;
}

static void __exit test_exit(void){
	remove_proc_entry("test-module",NULL);
	printk(KERN_INFO "Final\n");
}



module_init(test_init);
module_exit(test_exit);
MODULE_LICENSE("GPL");