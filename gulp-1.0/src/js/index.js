/**
 * Created by panxiong on 2017/3/15.
 */
import inc from './demo/inc.js';
console.log(inc.modules());
class A{
    constructor(a){
        this.b=a;
    }
    print(){
        console.log(this.b);
    }
}
var s=new A('2');
s.print();