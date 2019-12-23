/** ANALISIS LEXICO*/
%lex
%%
[ \r\t\n]+                                      {} // ESPACIOS
\/\/.([^\n])*                                   {} // COMENTARIO SIMPLE
\/\*(.?\n?)*\*\/                                {} // COMENTARIO MULTILINEA
"-"[0-9]+("."[0-9]+)                            return 'DECIMAL'
"-"[0-9]+                                       return 'ENTERO'
[0-9]+("."[0-9]+)                               return 'DECIMAL'
[0-9]+                                          return 'ENTERO'
"+"                                             return 'MAS'
[\'\‘\’].[\'\’\‘]                               return 'CARACTER'
[\"\“\”](([^\"\“\”\\])*([\\].)*)*[\"\“\”]       return 'CADENA'
[A-Za-z_\ñ\Ñ][A-Za-z_0-9\ñ\Ñ]*                  return 'ID'
<<EOF>>                                         {}
.                                               { console.err("Error");}//ERRORES
/lex

%left MAS
%start inicio

%%

/*
    SINTACTICO
*/

inicio : expresion                  { parser.arbol.raiz = []; parser.arbol.raiz.push($1);}
       ;


expresion : aritmetica              { $$ = $1; }
          | primitivo               { $$ = $1; }
          ;

aritmetica : expresion MAS expresion { $$ = new Aritmetica($1,$3,Operacion.SUMA,@1.first_linea,@1.first_column);}
           ;

primitivo : ENTERO                  {$$ = new Primitivo(Tipo.INT,$1,@1.first_line,@1.first_column);}
          | DECIMAL                 {$$ = new Primitivo(Tipo.DOUBLE,$1,@1.first_line,@1.first_column);}
          | CARACTER                {$$ = new Primitivo(Tipo.CHAR,$1,@1.first_line,@1.first_column);}
          | CADENA                  {$$ = new Primitivo(Tipo.STRING,$1,@1.first_line,@1.first_column);}
          | ID                      {$$ = new Primitivo(Tipo.ID,$1,@1.first_line,@1.first_column);}
          ;  
%%

parser.arbol ={
    raiz: null
};