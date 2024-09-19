---

title: TypeScript 探险记：类型安全的奥秘
date: 2024-06-05 18:00:00
post: comments
enable: true
categories: 
- 前端开发手册
tags: 
- 开发手册
---

#### 基础语法

类型注解的 TypeScript 与 JavaScript 完全一致

```JavaScript
let name = 'spencer';
```

只需要将变量后面添加: 类型注解就可以了，如下代码所示：

```JavaScript
let name: string = 'spencer';
```
#### 原始类型

JavaScript原始类型：string、number、bigint、boolean、undefined 和 symbol  

**注意事项：**

- 虽然`number`和`bigint`都表示数字，但是这两个类型不兼容。
- TypeScript 还包含 Number、String、Boolean、Symbol 等类型（注意区分大小写），不要将它们和小写格式对应的 number、string、boolean、symbol 进行等价

```JavaScript
let name: String = new String('spencer');
let name2: string = 'spencer'; 

console.log(name === name2); // false
```

#### 数组类型

我们可以通过[]的方式定义数组类型，例如：

```JavaScript
//子元素是数字类型的数组
let arrayAge: number[] = [28, 29, 30];
//子元素是字符串类型的数组
let arrayName: string[] = ['spencer', 'peter', 'john'];

```

也可以通过Array泛型的方式定义数组类型，例如：

```JavaScript
//子元素是数字类型的数组
let arrayAge: Array<number> = [28, 29, 30];
//子元素是字符串类型的数组
let arrayName: Array<string> = ['spencer', 'peter', 'john'];

```

为了避免与JSX产生语法冲突，推荐使用[]的方式

#### 特殊类型

**1、any**

any是指一个任意类型，用来选择性绕过静态类型检测。并且any 类型会在对象的调用链中进行传导，即所有 any 类型的任意属性的类型都是 any。

any是一个坏习惯，除非有充足的理由，否则应该尽量避免使用any

```JavaScript
let anything: any = {};
anything.doAnything(); 
anything = 1; 
anything = 'x'; 
let z = anything.x.y.z; 
z(); 
```

**2、unknown**

unknown 是 TypeScript 3.0 中添加的一个类型，它主要用来描述类型并不确定的变量。与any不同的是，unknown更安全，我们可以将任意类型的值赋值给unknown，但是unknown类型的值只能赋值给unknown或any。

使用unknown时，TypeScript还是会对它做类型检测的，并且如果在使用过程中不缩小类型的话，在后续的执行过程中也是会出现错误的，例如：

```JavaScript
let weight: unknown;
weight.toFixed(); // Object is of type 'unknown'.(2571)

```

应该进行类型缩小，才会避免报错，如下代码所示：

```JavaScript
let weight: unknown;
if (typeof weight === 'number') {
  weight.toFixed(); 
}
```

**3、void**

对于函数表示没有返回值的函数。

```JavaScript
interface UserInfo = {
  work: ()=>void
}

```

在严格模式下，对于变量设置void类型则是几乎没有什么用处，因为不能将void类型的变量赋值给除了any和unknown之外的任何类型变量。

**4、undefined**

undefined表示未定义的意思，在接口类型中有一定价值，例如：

```JavaScript
interface UserInfo {
  name: string;
  age?: number;
}
```

因为age属性被标注为可缺省，就相当于它的类型是`number`类型与`undefined`的联合类型，但你不能手动将`number | undefined` 直接设置为age的类型，两者是不等价的，例如：

```JavaScript
interface UserInfo {
  name: string;
  age: number | undefined;
}
```

上面`?: `意味着可缺省，你可以不为这个属性赋值，但是类型undefined只是表示未定义，不代表该属性可缺省。

**5、null**

null表示值可能为空。它的主要价值在于接口的指定上，例如：

```JavaScript
interface UserInfo: {
  name: null | string
}
```

对于undefined和null我们在实际开发中要做好容错处理，例如：

```JavaScript
const userInfo: {
  name: null | string
}
if(userInfo.name != null){
  ...
} 
```

**6、never**

never是指永远不会发生值的类型

例如一个抛错的函数，函数永远不会有返回值，所以返回值类型为never，代码如下所示：

```JavaScript
function ThrowError(msg: string): never {
  throw Error(msg);
}

```

never是所有类型的子类型，可以赋值给所有类型，但是反过来，除了never自身以外，其他类型都不能为never类型赋值。

在恒为false的条件判断下，变量类型就会被缩小为never类型，因为上面提到了never是所有类型的子类型，所以缩小到never类型，所以这种恒为false情况会提示错误给我们，如下代码所示：

```JavaScript
const name: string = 'spencer';
if (typeof name === 'number') {
  name.toFixed(); // Property 'toFixed' does not exist on type 'never'.ts(2339)
}

```
#### 接口类型

```JavaScript
function work(action: { coding: string }) {
  console.log(action.coding);
}

let myAction = { meeting: "have a meeting", coding: "TypeScript" };
work(myAction);
```

换成接口类型写法

使用interface关键字来抽离可复用的接口类型

```JavaScript
interface ActionValue {
  coding: string;
}

function work(action: ActionValue) {
  console.log(action.coding);
}

let myAction = { meeting: "have a meeting", coding: "TypeScript" };
work(myAction);
let myAction2: ActionValue = { meeting: "have a meeting", coding: "CSS" };
work(myAction2);//报错

```
#### Type类型别名

通过type 别名名称 = 类型定义的形式来定义类型别名，如下所示：

```JavaScript
type User = {
  name: string;
  age: number;
}
```

#### Interface 与 Type 的区别

大多数情况下都可以互相替代，但是如果遇到重复定义的时候两者会有区别，重复定义接口类型，他的属性会叠加，重复定义类型别名，ts会报错。

```text
{
  interface Language {
    id: number;
  }
  
  interface Language {
    name: string;
  }
  let lang: Language = {
    id: 1, // ok
    name: 'name' // ok
  }
}
{
  /** ts(2300) 重复的标志 */
  type Language = {
    id: number;
  }
  
  /** ts(2300) 重复的标志 */
  type Language = {
    name: string;
  }
  let lang: Language = {
    id: 1,
    name: 'name'
  }
}

```
#### 类类型

#### 公共、私有、受保护的修饰符

- public 修饰的是在任何地方可见、公有的属性或方法；
- private 修饰的是仅在同一类中可见、私有的属性或方法；
- protected 修饰的是仅在类自身及子类中可见、受保护的属性或方法。

在不设置的时候默认都是public

```JavaScript
class Person {
  public firstName: string;
  private lastName: string = 'Peter';
  constructor(firstName: string) {
    this.firstName = firstName;
    this.lastName; // ok
  }
}

const person = new Person('John');
console.log(person.firstName); //  => "John"
person.firstName = 'Victor';
console.log(person.firstName); //  => "Victor"
console.log(person.lastName); // Property 'lastName' is private and only accessible within class 'Person'.(2341)

```

TypeScript 中定义类的私有属性仅仅代表静态类型检测层面的私有。如果我们强制忽略 TypeScript 类型的检查错误，转译且运行 JavaScript 时依旧可以获取到私有属性，因为 JavaScript 并不支持真正意义上的私有属性。

受保护属性和方法示例如下：

```JavaScript
class Person {
  public firstName: string;
  protected lastName: string = 'Peter';
  constructor(firstName: string) {
    this.firstName = firstName;
    this.lastName; // ok
  }
}
class Programmer extends Person {
  constructor(firstName: string) {
    super(firstName);
  }
​
  public getLastName() {
    return this.lastName;
  }
}
const programmer = new Programmer('John');
console.log(programmer.getLastName()); // => "Peter"
programmer.lastName; //Property 'lastName' is protected and only accessible within class 'Person' and its subclasses.(2445)
```

#### 只读修饰符 - `readonly`

```JavaScript
class Person {
  public readonly firstName: string;
  constructor(firstName: string) {
    this.firstName = firstName;
  }
}

const person = new Person('John');
person.firstName = 'Victor'; // ts(2540) Cannot assign to 'firstName' because it is a read-only property.

```

#### 静态属性

静态属性可以直接通过类访问，而不用实例化

```JavaScript
class Person {
  static name = 'Spencer';
  static getAge() {
    //...
  }
}

console.log(Person.name); // => "Spencer"
console.log(Person.getAge());

```

#### 抽象类

它是一种不能被实例化仅能被子类继承的特殊类。我们可以使用抽象类定义派生类需要实现的属性和方法如下代码所示：

```JavaScript
abstract class Adder {
  abstract x: number;
  abstract y: number;
  abstract add(): number;
  displayName = 'Adder';
  addTwice(): number {
    return (this.x + this.y) * 2;
  }
}

class NumAdder extends Adder {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  add(): number {
    return this.x + this.y;
  }
}

const numAdder = new NumAdder(1, 2);
console.log(numAdder.displayName); // => "Adder"
console.log(numAdder.add()); // => 3
console.log(numAdder.addTwice()); // => 6

```

继承自Adder的派生类 NumAdder， 实现了抽象类里定义的 x、y 抽象属性和 add 抽象方法。如果派生类中缺少对 x、y、add 这三者中任意一个抽象成员的实现，ts是会报错提示的
#### 泛型

泛型指的是类型参数化，即将原来某种具体的类型进行参数化。和定义函数参数一样，我们可以给泛型定义若干个类型参数，并在**调用时**给泛型传入明确的类型参数。设计泛型的目的在于有效约束类型成员之间的关系，比如函数参数和返回值、类或者接口成员和方法之间的关系。

比如定义了一个 reflect 函数 ，它可以接收一个任意类型的参数，并原封不动地返回参数的值和类型，那我们该如何描述这个函数呢？好像只能用any了。

```JavaScript
function reflect(param: any) {
  return param;
}
const str = reflect('string');
const num = reflect(1);
```

此时，泛型正好可以满足这样的诉求，因为泛型就是将参数的类型定义为一个参数、变量，而不是一个明确的类型，等到函数调用时再传入明确的类型。

我们可以通过尖括号 <> 语法给函数定义一个泛型参数 P，并指定 param 参数的类型为 P ，如下代码所示：

```JavaScript
function reflect<P>(param: P) {
  return param;
}

const reflectStr = reflect<string>('string');
const reflectNum = reflect<number>(1);

```

这里我们可以看到，尖括号中的 P 表示泛型参数的定义，param 后的 P 表示参数的类型是泛型 P（即类型受 P 约束）。

然后在调用函数时，我们也通过 <> 语法指定了如下所示的 string、number 类型入参，相应地，reflectStr 的类型是 string，reflectNum 的类型是 number。

另外，如果调用泛型函数时受泛型约束的参数有传值，泛型参数的入参可以从参数的类型中进行推断，而无须再显式指定类型（可缺省），因此上边的示例可以简写为如下示例：

```JavaScript
const reflectStr2 = reflect('string');
const reflectNum2 = reflect(1); 
```

注意：函数的泛型入参必须和参数/参数成员建立有效的约束关系才有实际意义。
#### 在 Vue3 中使用 typescript
##### 在单文件组件中的用法​
要在单文件组件中使用 TypeScript，需要在 `<script>` 标签上加上 lang="ts" 的 attribute。当 lang="ts" 存在时，所有的模板内表达式都将享受到更严格的类型检查。

```
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- 启用了类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```
##### TS 与组合式 API
通过泛型参数来定义 props 的类型
```
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```
为 `ref()`标注类型
```
// 得到的类型：Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // 成功！
```
##### 为组件模版引用标注类型
例如我们想要调用 Modal 组件的 open 方法
```
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```
为了获取 `MyModal` 的类型，我们首先需要通过 `typeof` 得到其类型，再使用 TypeScript 内置的 `InstanceType` 工具类型来获取其实例类型：
```
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```