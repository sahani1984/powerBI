import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(data: any[], searchTerms:string, searchby:any[])  {     
    if(!data) return [];
    if(!searchby || !searchby?.length) return data;    
    return data.filter((search)=>{
      let isfound:boolean=false;
      for(let i=0; i<searchby.length; i++){       
        if(search[searchby[i]]?.toLowerCase().includes(searchTerms?.toLowerCase())){
          isfound=true;
          break;
        }
      }
      return isfound;
    })
  }

  // transform(items: any[], field:string, value: string): any[] {
  //   if(!items) return [];
  //   if(!value) return items;
  //     return items.filter( str => {
  //     return str[field].toLowerCase().includes(value.toLowerCase());
  //  });
  //}
  }


