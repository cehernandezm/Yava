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
"{"                                             return 'LLAVEIZQ'
"}"                                             return 'LLAVEDER'
";"                                             return 'PNTCOMA'
[\'\‘\’].[\'\’\‘]                               return 'CARACTER'
[\"\“\”](([^\"\“\”\\])*([\\].)*)*[\"\“\”]       return 'CADENA'


"class"                                         return 'CLASS'    
"private"                                       return 'PRIVATE'
"public"                                        return 'PUBLIC'
"protected"                                     return 'PROTECTED'
"static"                                        return 'STATIC'
"abstract"                                      return 'ABSTRACT'
"final"                                         return 'FINAL'   
"extends"                                       return 'EXTENDS' 

"int"                                           return 'INT'
"double"                                        return 'DOUBLE'
"char"                                          return 'CHAR'
"boolean"                                       return 'BOOLEAN'
"String"                                        return 'STRING'


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

inicio : contenido                                              { parser.arbol.raiz = new Analizar($1); }
       ;



contenido : contenido declaracionClase                          { $$ = $1; $$.push($2);}
          | contenido import_sentence
          | declaracionClase                                    { $$ = []; $$.push($1); } 
          | import_sentence
          ;

// ##############################################################
// #################### CLASES ##################################
// ##############################################################

declaracionClase : CLASS ID LLAVEIZQ  bloqueClase LLAVEDER                                          { $$ = new Clase(null,$2,$4,null,@1.first_line,@1.first_column); }
                 | CLASS ID EXTENDS ID LLAVEIZQ bloqueClase LLAVEDER                                { $$ = new Clase(null,$2,$6,$4,@1.first_line,@1.first_column);}
                 | modificador CLASS ID LLAVEIZQ bloqueClase LLAVEDER                              { $$ = new Clase($1,$3,$5,null,@1.first_line,@1.first_column); }
                 | modificador CLASS ID EXTENDS ID LLAVEIZQ bloqueClase LLAVEDER                    { $$ = new Clase($1,$3,$7,$5,@1.first_linea,@1.first_column)}
                 ;


modificador : modificador PROTECTED                                         { $$ = $1; $$.push(Modificador.PROTECTED); }
            | modificador PRIVATE                                           { $$ = $1; $$.push(Modificador.PRIVATE); }
            | modificador PUBLIC                                            { $$ = $1; $$.push(Modificador.PUBLIC); }
            | modificador STATIC                                            { $$ = $1; $$.push(Modificador.STATIC); }
            | modificador ABSTRACT                                          { $$ = $1; $$.push(Modificador.ABSTRACT); }
            | modificador FINAL                                             { $$ = $1; $$.push(Mofificador.FINAL); }
            | PROTECTED                                                     { $$ = []; $$.push(Modificador.PROTECTED); }
            | PRIVATE                                                       { $$ = []; $$.push(Modificador.PRIVATE); }
            | PUBLIC                                                        { $$ = []; $$.push(Modificador.PUBLIC); }
            | STATIC                                                        { $$ = []; $$.push(Modificador.STATIC); }
            | ABSTRACT                                                      { $$ = []; $$.push(Modificador.ABSTRACT); }
            | FINAL                                                         { $$ = []; $$.push(Modificador.FINAL); }
            ;


bloqueClase : bloqueClase bloque                            { $$ = $1; $$.push($2); }
            | bloque                                        { $$ = []; $$.push($1); }
            ;

bloque : declaracionVariable PNTCOMA                                { $$ = $1; }
       ;


declaracionVariable : modificador tipo ID                   { $$ = new Declaracion($3,$1,$2.tipo,$2.valor,@1.first_linea,@1.first_column); }
                    | tipo ID                               { $$ = new Declaracion($2,null,$1.tipo,$1.valor,@1.first_linea,@1.first_column); }
                    ;


tipo : STRING                                       { $$ = new Valor(Tipo.STRING,""); }
     | INT                                          { $$ = new Valor(Tipo.INT,""); }
     | DOUBLE                                       { $$ = new Valor(Tipo.DOUBLE,""); }
     | CHAR                                         { $$ = new Valor(Tipo.CHAR,""); }
     | BOOLEAN                                      { $$ = new Valor(Tipo.BOOLEAN,""); }
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