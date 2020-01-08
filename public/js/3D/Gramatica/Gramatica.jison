%lex

%options case-insensitive

%%
[ \r\t\n]+                                  {} // ESPACIOS
[;]+.*                                      {} // COMENTARIO SIMPLE
"-"[0-9]+("."[0-9]+)                        return 'DECIMAL'
"-"[0-9]+                                   return 'ENTERO'
[0-9]+("."[0-9]+)                           return 'DECIMAL'
[0-9]+                                      return 'ENTERO'

","                                         return 'COMA'
":"                                         return 'DSPUNTOS'
"("                                         return 'PARIZQ'
")"                                         return 'PARDER'
"["                                         return 'CORIZQ'
"]"                                         return 'CORDER'
"{"                                         return 'LLAVEIZQ'
"}"                                         return 'LLAVEDER'


"<="                                        return 'MENORIGUAL'
">="                                        return 'MAYORIGUAL'
"=="                                        return 'IGUALIGUAL'
"!="                                        return 'DIFERENTE'
"<"                                         return 'MENOR'
">"                                         return 'MAYOR'

"+"                                         return 'MAS'
"-"                                         return 'MENOS'
"*"                                         return 'POR'
"/"                                         return 'DIVIDIR'
"%"                                         return 'MODULO'
"^"                                         return 'POTENCIA'
"="                                         return "IGUAL"


"HEAP"                                      return 'HEAP'
"STACK"                                     return 'STACK'
"H"                                         return 'H'
"P"                                         return 'P'

"E"                                         return 'IE'
"C"                                         return 'IC'
"D"                                         return 'ID'
"PRINT"                                     return 'PRINT'
"PROC"                                      return 'PROC'
"CALL"                                      return 'CALL'

"if"                                        return 'IF'
"ifFalse"                                   return 'IFFALSE'
"goto"                                      return 'GOTO'
"then"                                      return 'THEN'
"var"                                       return 'VAR'

"write"                                     return 'WRITE'
"exit"                                      return 'EXIT'


"T"[0-9]+                                   return 'TEMPORAL'
"L"[0-9]+                                   return 'ETIQUETA'

[A-Za-z]+["_""-"0-9A-Za-z]*                 return 'ID'

<<EOF>>                                     {}
.					                        { parser.arbol.errores.push({tipo : 'Lexico', mensaje: yytext , linea: yylloc.first_line , columna: yylloc.first_column}); }
/lex

%start inicio
%%

/*
* ANALISIS SINTACTICO
*/
inicio: instrucciones                                {parser.arbol.raiz = $1; parser.linea = 0;}
      | error                                        { parser.arbol.errores.push({tipo: 'Sintactico', mensaje : yytext , linea : this._$.first_line , columna: this._$.first_column}); }
      ;


instrucciones : instrucciones instruccion            {$$ = $1; $$.push($2); parser.linea++;}
              | instruccion                          {$$ = []; $$.push($1); parser.linea++;}
              ;


instruccion : asignacion                             {$$ = $1;}
            | etiqueta                               {$$ = $1;}
            | incondicional                          {$$ = $1;}
            | condicional                            {$$ = $1;}
            | imprimir                               {$$ = $1;}
            | funcion                                {$$ = $1;}
            | callFuncion                            {$$ = $1;}
            | declaracion                            {$$ = $1;}
            | write_sentence                         {$$ = $1;}
            | exit_sentence                          {$$ = $1;}
            ;
            
declaracion : VAR ID IGUAL e                         {$$ = new Declaracion3D($2,$4,@1.first_line,@1.first_column,parser.linea); }
            ;


instruccionesF : instruccionesF instruccionF            {$$ = $1; $$.push($2); parser.linea++;}
               | instruccionF                           {$$ = []; $$.push($1); parser.linea++;}
               ;


instruccionF : asignacion                             {$$ = $1;}
             | etiqueta                               {$$ = $1;}
             | incondicional                          {$$ = $1;}
             | condicional                            {$$ = $1;}
             | imprimir                               {$$ = $1;}
             | callFuncion                            {$$ = $1;}
             | write_sentence                         {$$ = $1;}
             | exit_sentence                          {$$ = $1;}
            ;

asignacion : var IGUAL e operacion e                        {$$ = new Asignacion3D($3,$5,$4,$1,@1.first_line,@1.first_column,parser.linea);} 
           | estructura CORIZQ e CORDER IGUAL e             {$$ = new Asignacion3D($3,$6,"igual",$1,@1.first_line,@1.first_column,parser.linea);} // H|S [e] = e;
           | var IGUAL e                                    {$$ = new Asignacion3D($3,null,"igual",$1,@1.first_line,@1.first_column,parser.linea);}// T = e        
           | var IGUAL estructura CORIZQ e CORDER           {$$ = new Asignacion3D(new Valor3D({tipo :$3, valor: 0, linea: @1.first_line, columna: @1.first_column}),$5,"igual",$1,@1.first_line,@1.first_column,parser.linea);}// T = e 
           ;


var : TEMPORAL                                              {$$ = $1}
    | H                                                     {$$ = "h"}
    | P                                                     {$$ = "p"}
    ;

estructura : HEAP                                           {$$ = "heap";}
           | STACK                                          {$$ = "stack";}
           ;


operacion : MAS                                             {$$ = "suma";}
          | MENOS                                           {$$ = "resta";}
          | POR                                             {$$ = "multiplicacion";}
          | DIVIDIR                                         {$$ = "division";}
          | MODULO                                          {$$ = "modulo";}
          | POTENCIA                                        {$$ = "potencia";}
          ;

e : ENTERO                                   {$$ = new Valor3D({tipo : "int", valor: $1, linea: @1.first_line, columna: @1.first_column});}
  | TEMPORAL                                 {$$ = new Valor3D({tipo : "temporal", valor: $1, linea: @1.first_line, columna: @1.first_column});}
  | DECIMAL                                  {$$ = new Valor3D({tipo: "double", valor:  $1, linea: @1.first_line, columna: @1.first_column});}
  | H                                        {$$ = new Valor3D({tipo: "h", valor:  $1, linea: @1.first_line, columna: @1.first_column});}
  | P                                        {$$ = new Valor3D({tipo: "p", valor:  $1, linea: @1.first_line, columna: @1.first_column});}
  | ID                                       {$$ = new Valor3D({tipo : "temporal", valor: $1, linea: @1.first_line, columna: @1.first_column});}
  ;




etiqueta : ETIQUETA DSPUNTOS                 {$$ = new Etiqueta($1,@1.first_line,@1.first_column,parser.linea);}
         ;


incondicional : GOTO ETIQUETA                   { $$ = new Incondicional(parser.linea,@1.first_line,@1.first_column, $2);}
              ;

condicional : IF e operador e THEN GOTO ETIQUETA              {$$ = new Condicional(parser.linea,@1.first_line,@1.first_column,$3,$2,$4,$7,0);}
            | IFFALSE e operador e GOTO ETIQUETA         {$$ = new Condicional(parser.linea,@1.first_line,@1.first_column,$3,$2,$4,$6,1);}
            ;

operador : IGUALIGUAL                  {$$ = "=="}
         | DIFERENTE                   {$$ = "!="}
         | MAYOR                       {$$ = ">"}
         | MENOR                       {$$ = "<"}
         | MAYORIGUAL                  {$$ = ">="}
         | MENORIGUAL                  {$$ = "<="}
         ;



imprimir : PRINT PARIZQ MODULO IE COMA e PARDER    { $$ = new Print(0,$6,@1.first_line,@1.first_column,parser.linea); }
         | PRINT PARIZQ MODULO IC COMA e PARDER    { $$ = new Print(1,$6,@1.first_line,@1.first_column,parser.linea); }
         | PRINT PARIZQ MODULO ID COMA e PARDER    { $$ = new Print(2,$6,@1.first_line,@1.first_column,parser.linea); }      
         ;


funcion : PROC ID LLAVEIZQ instruccionesF LLAVEDER          { $$ = new Funcion($2,$4,@1.first_line,@1.first_column,parser.linea);}
        ;
callFuncion : CALL  ID                                   {$$ = new CallFuncion($2,@1.first_line,@1.first_column,parser.linea);}
            ;


write_sentence : WRITE PARIZQ e PARDER             { $$ = new Write3D($3,@1.first_line,@1.first_column,parser.linea); }
               ;

exit_sentence : EXIT PARIZQ e PARDER              { $$ = new Exit($3,@1.first_line,@1.first_column,parser.linea); }
              ;

%%

parser.arbol = {
    raiz: null,
    errores : []
};

parser.linea = 0;