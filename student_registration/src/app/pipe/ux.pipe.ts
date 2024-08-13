import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'uxpipe'
})

export class Uxpipe implements PipeTransform{

    transform(value: any, ...args: any[]) {
       value = 1.8*value + 32; 
       console.log(value);
    }
}