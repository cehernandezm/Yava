/** ANALISIS LEXICO*/
%lex
%%
[ \r\t\n]+                                      {} // ESPACIOS
\/\/.([^\n])*                                   {} // COMENTARIO SIMPLE
\/\*(.?\n?)*\*\/                                {} // COMENTARIO MULTILINEA
[0-9]+("."[0-9]+)                               return 'DECIMAL'
[0-9]+                                          return 'ENTERO'

"++"                                            return 'INCREMENTO'
"--"                                            return 'DECREMENTO'
"+"                                             return 'MAS'
"-"                                             return 'MENOS'
"*"                                             return 'MULTIPLICACION'            
"/"                                             return 'DIVISION' 


"<="                                            return 'MENORIGUAL'
">="                                            return 'MAYORIGUAL'
"!="                                            return 'DIFERENTE'
"=="                                            return 'IGUALIGUAL'
">"                                             return 'MAYOR'
"<"                                             return 'MENOR'

"?"                                             return 'TERNARIO'
":"                                             return 'DSPUNTOS'
"."                                             return 'PUNTO'


"{"                                             return 'LLAVEIZQ'
"}"                                             return 'LLAVEDER'
"("                                             return 'PARIZQ'
")"                                             return 'PARDER'
"["                                             return 'CORIZQ'
"]"                                             return 'CORDER'
";"                                             return 'PNTCOMA'
","                                             return 'COMA' 
"="                                             return 'IGUAL'

"||"                                            return 'OR'
"&&"                                            return 'AND'
"!"                                             return 'NEGACION'

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
"true"                                          return 'TRUE'
"false"                                         return 'FALSE'

"pow"                                           return 'POW'
"print"                                         return 'PRINT'
"println"                                       return "PRINTLN"

"str"                                           return 'STR'
"toInt"                                         return 'TOINT'
"toDouble"                                      return 'TODOUBLE'

"if"                                            return 'IF'
"else"                                          return 'ELSE'

"switch"                                        return 'SWITCH'
"case"                                          return 'CASE'
"default"                                       return 'DEFAULT'

"break"                                         return 'BREAK'
"continue"                                      return 'CONTINUE'

"while"                                         return 'WHILE'
"do"                                            return 'DO'
"for"                                           return 'FOR'

"new"                                           return 'NEW'

"length"                                        return "LENGTH"

"void"                                          return "VOID"
"return"                                        return 'RETURN'

"this"                                          return 'THIS'
"null"                                          return 'NULL';

[A-Za-z_\ñ\Ñ][A-Za-z_0-9\ñ\Ñ]*                  return 'ID'
<<EOF>>                                         {}
.                                               { console.log("Error"); }//ERRORES
/lex


%right                              IGUAL
%right                              TERNARIO,DSPUNTOS

%left                               OR
%left                               AND
%left                               MAYOR,MAYORIGUAL,MENOR,MENORIGUAL 
%left                               DIFERENTE,IGUALIGUAL

%left                               MAS,MENOS
%left                               MULTIPLICACION, DIVISION
%right                              NEGACION
%right                              UMENOS

%right                              NEW

%right                              INCREMENTO
%right                              DECREMENTO
%left                               PARIZQ
%right                              PARDER
%left                               LLAVEIZQ
%right                              LLAVEDER 
%left                               CORIZQ
%left                               PUNTO






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
                 | modificador CLASS ID EXTENDS ID LLAVEIZQ bloqueClase LLAVEDER                    { $$ = new Clase($1,$3,$7,$5,@1.first_line,@1.first_column)}
                 ;

// ####################################################
// #################### MODIFICADORES #################
// ####################################################

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

//#############################################################
//################### INSTRUCCIONES DE UNA CLASE ##############
//#############################################################
bloqueClase : bloqueClase bloque                            { $$ = $1; $$ = $$.concat($2); }
            | bloque                                        { $$ = $1; }
            ;

bloque : declaracionVariable PNTCOMA                                { $$ = $1; }
       | declaracionConstructor                                     { $$ = []; $$.push($1); }
       | funcion_statement                                          { $$ = []; $$.push($1); }
       ;


//########################################################################
//################# DECLARACION DE CONSTRUCTORES #########################
//########################################################################
declaracionConstructor : modificador ID PARIZQ PARDER LLAVEIZQ instrucciones LLAVEDER                              { $$ = new Constructor($2,[],$6,@1.first_line,@1.first_column); }   
                       | modificador ID PARIZQ listaParametros PARDER LLAVEIZQ instrucciones LLAVEDER              { $$ = new Constructor($2,$4,$7,@1.first_line,@1.first_column); }
                       ;

//######################################################################################
//##################### INSTRUCCIONES PARA METODOS #####################################
//######################################################################################

instrucciones : instrucciones instruccion                                         { $$ = $1; $$ = $$.concat($2); }
              | instruccion                                                       { $$ = $1; }
              ;

instruccion : declaracionLocal PNTCOMA                                                    { $$ = $1; }
            | asignacion_statement PNTCOMA                                                { $$ = $1; }
            | print_statement PNTCOMA                                                     { $$ = $1; }
            | unaria PNTCOMA                                                              { $$ = []; $$.push($1); }
            | if_superior                                                                 { $$ = []; $$.push($1); }
            | switch_statement                                                            { $$ = []; $$.push($1); }
            | break_statement  PNTCOMA                                                    { $$ = []; $$.push($1); }
            | while_statement                                                             { $$ = []; $$.push($1); }
            | continue_statement PNTCOMA                                                  { $$ = []; $$.push($1); }
            | dowhile_statement PNTCOMA                                                   { $$ = []; $$.push($1); }
            | for_statement                                                               { $$ = []; $$.push($1); }
            | call_function PNTCOMA                                                       { $$ = []; $$.push($1); }
            | return_statement PNTCOMA                                                    { $$ = []; $$.push($1); }
            | expresion PUNTO ID PARIZQ PARDER PNTCOMA                                    { $$ = [];  $$.push(new accederAFunciones($1,$3,[],@1.first_line,@1.first_column)); }
            | expresion PUNTO ID PARIZQ listaExpresiones PARDER PNTCOMA                   { $$ = []; $$.push(new accederAFunciones($1,$3,$5,@1.first_line,@1.first_column)); }
            ;




//########################################################################################
//############################### ASIGNACION #############################################
//########################################################################################
asignacion_statement : ID IGUAL expresion                                                   {$$ = []; $$.push(new Asignacion($1,$3,@1.first_line,@1.first_column,0)); }
                     | ID listaDimensiones IGUAL expresion                                 { $$ = []; $$.push(new AsignarArreglo(new Primitivo(Tipo.ID,$1,@1.first_line,@1.first_column),$2,$4,@1.first_line,@1.first_column)); }
                     | THIS PUNTO ID IGUAL expresion                                        {$$ = []; $$.push(new Asignacion($3,$5,@1.first_line,@1.first_column,1)); }
                     | expresion PUNTO ID IGUAL expresion                                   { $$ = []; $$.push(new asignarAtributo($1,$3,$5,@1.first_line,@1.first_column)); }
                     ;

variable: THIS PUNTO ID                              { $$ = new elementThis($3,@1.first_line,@1.first_column); }
        ;


//########################################################################################
//##################### DECLARACION DE VARIABLES LOCALES #################################
//########################################################################################
declaracionLocal :  modificador tipo ID                                    { $$ = []; $$.push(new Declaracion($3,$1,$2.tipo,$2.valor,@1.first_line,@1.first_column)); }
                    | tipo ID                                              { $$ = []; $$.push(new Declaracion($2,null,$1.tipo,$1.valor,@1.first_line,@1.first_column)); }
                    | modificador tipo ID IGUAL expresion                  { $$ = []; $$.push(new Declaracion($3,$1,$2.tipo,$2.valor,@1.first_line,@1.first_column)); $$.push(new Asignacion($3,$5,@1.first_line,@1.first_column)); }
                    | tipo ID IGUAL expresion                              { $$ = []; $$.push(new Declaracion($2,null,$1.tipo,$1.valor,@1.first_line,@1.first_column)); $$.push(new Asignacion($2,$4,@1.first_line,@1.first_column,0)); }
                    | modificador tipo listaArreglo ID                     { $$ = []; $$.push(new Declaracion($4,$1,Tipo.ARREGLO,new Arreglo($2.tipo,$2.valor),@1.first_line,@1.first_column,$3),$3); }
                    | tipo listaArreglo ID                                 { $$ = []; $$.push(new Declaracion($3,null,Tipo.ARREGLO,new Arreglo($1.tipo,$1.valor),@1.first_line,@1.first_column,$2)); }
                    | modificador tipo listaArreglo ID IGUAL expresion     { $$ = []; $$.push(new Declaracion($4,$1,Tipo.ARREGLO,new Arreglo($2.tipo,$2.valor),@1.first_line,@1.first_column,$3)); $$.push(new Asignacion($4,$6,@1.first_line,@1.first_column)); }
                    | tipo listaArreglo ID IGUAL expresion                 { $$ = []; $$.push(new Declaracion($3,null,Tipo.ARREGLO,new Arreglo($1.tipo,$1.valor),@1.first_line,@1.first_column,$2)); $$.push(new Asignacion($3,$5,@1.first_line,@1.first_column)); }
                    | ID ID IGUAL expresion                                { $$ = []; $$.push(new Declaracion($2,null,Tipo.ID,$1,@1.first_line,@1.first_column,$2)); $$.push(new Asignacion($2,$4,@1.first_line,@1.first_column,0)); }
                    | ID ID                                                { $$ = []; $$.push(new Declaracion($2,null,Tipo.ID,$1,@1.first_line,@1.first_column)); }
                    | modificador ID ID IGUAL expresion                    { $$ = []; $$.push(new Declaracion($3,$1,Tipo.ID,$2,@1.first_line,@1.first_column)); $$.push(new Asignacion($3,$5,@1.first_line,@1.first_column)); }
                    | modificador ID ID                                    { $$ = []; $$.push(new Declaracion($3,$1,Tipo.ID,$2,@1.first_line,@1.first_column)); }
                    ;


//###################################################################
//################ LISTA DE DIMENSIONES ################
//###################################################################
listaArreglo : listaArreglo CORIZQ CORDER                               { $$ = +$1; $$++; }
             | CORIZQ CORDER                                            { $$ = 1; }
             ;



//###################################################################
//################ DECLARACION DE VARIABLES DE CLASE ################
//###################################################################
declaracionVariable : modificador tipo ID                                  { $$ = []; $$.push(new Declaracion($3,$1,$2.tipo,$2.valor,@1.first_line,@1.first_column)); }
                    | tipo ID                                              { $$ = []; $$.push(new Declaracion($2,null,$1.tipo,$1.valor,@1.first_line,@1.first_column)); }
                    | modificador tipo ID IGUAL expresion                  { $$ = []; $$.push(new Declaracion($3,$1,$2.tipo,$2.valor,@1.first_line,@1.first_column)); $$.push(new Asignacion($3,$5,@1.first_line,@1.first_column)); }
                    | tipo ID IGUAL expresion                              { $$ = []; $$.push(new Declaracion($2,null,$1.tipo,$1.valor,@1.first_line,@1.first_column)); $$.push(new Asignacion($2,$4,@1.first_line,@1.first_column,0)); }
                    | modificador tipo listaArreglo ID                     { $$ = []; $$.push(new Declaracion($4,$1,Tipo.ARREGLO,new Arreglo($2.tipo,$2.valor),@1.first_line,@1.first_column,$3),$3); }
                    | tipo listaArreglo ID                                 { $$ = []; $$.push(new Declaracion($3,null,Tipo.ARREGLO,new Arreglo($1.tipo,$1.valor),@1.first_line,@1.first_column,$2)); }
                    | modificador tipo listaArreglo ID IGUAL expresion     { $$ = []; $$.push(new Declaracion($4,$1,Tipo.ARREGLO,new Arreglo($2.tipo,$2.valor),@1.first_line,@1.first_column,$3)); $$.push(new Asignacion($4,$6,@1.first_line,@1.first_column)); }
                    | tipo listaArreglo ID IGUAL expresion                 { $$ = []; $$.push(new Declaracion($3,null,Tipo.ARREGLO,new Arreglo($1.tipo,$1.valor),@1.first_line,@1.first_column,$2)); $$.push(new Asignacion($3,$5,@1.first_line,@1.first_column)); }
                    | ID ID IGUAL expresion                                { $$ = []; $$.push(new Declaracion($2,null,Tipo.ID,$1,@1.first_line,@1.first_column,$2)); $$.push(new Asignacion($2,$4,@1.first_line,@1.first_column,0)); }
                    | ID ID                                                { $$ = []; $$.push(new Declaracion($2,null,Tipo.ID,$1,@1.first_line,@1.first_column)); }
                    | modificador ID ID IGUAL expresion                    { $$ = []; $$.push(new Declaracion($3,$1,Tipo.ID,$2,@1.first_line,@1.first_column)); $$.push(new Asignacion($3,$5,@1.first_line,@1.first_column)); }
                    | modificador ID ID                                    { $$ = []; $$.push(new Declaracion($3,$1,Tipo.ID,$2,@1.first_line,@1.first_column)); }
                    ;


//#######################################################################
//##################### TIPOS DE DATOS ##################################
//#######################################################################
tipo : STRING                                       { $$ = new Valor(Tipo.STRING,""); }
     | INT                                          { $$ = new Valor(Tipo.INT,""); }
     | DOUBLE                                       { $$ = new Valor(Tipo.DOUBLE,""); }
     | CHAR                                         { $$ = new Valor(Tipo.CHAR,""); }
     | BOOLEAN                                      { $$ = new Valor(Tipo.BOOLEAN,""); }
     ;



expresion : aritmetica                                          { $$ = $1; }
          | relacional                                          { $$ = $1; }
          | logica                                              { $$ = $1; }  
          | casteo                                              { $$ = $1; }
          | ternario                                            { $$ = $1; }
          | str_statement                                       { $$ = $1; }
          | variable listaDimensiones                          
          | variable                                            { $$ = $1; }
          | ID listaDimensiones                                 { $$ = new AccesoArreglo(new Primitivo(Tipo.ID,$1,@1.first_line,@1.first_column),$2,@1.first_line,@1.first_column); }
          | arreglo_statement                                   { $$ = $1; }
          | toint_statement                                     { $$ = $1; }
          | unaria                                              { $$ = $1; }
          | PARIZQ expresion PARDER                             { $$ = $2; }
          | LLAVEIZQ listaExpresiones LLAVEDER                  { $$ = new listaValores($2,@1.first_line,@1.first_column); }
          | expresion PUNTO LENGTH                              { $$ = new Length($1,@1.first_line,@1.first_column); }
          | expresion PUNTO LENGTH PARIZQ PARDER                { $$ = new Length($1,@1.first_line,@1.first_column); }
          | primitivo                                           { $$ = $1; }
          | call_function                                       { $$ = $1; }
          | NEW ID PARIZQ PARDER                                { $$ = new callConstructor($2,[],@1.first_line,@1.first_column); }
          | NEW ID PARIZQ listaExpresiones PARDER               { $$ = new callConstructor($2,$4,@1.first_line,@1.first_column); }
          | expresion PUNTO ID                                  { $$ = new accederAtributo($1,$3,@1.first_line,@1.first_column); }
          | expresion PUNTO ID PARIZQ PARDER                    { $$ = new accederAFunciones($1,$3,[],@1.first_line,@1.first_column); }
          | expresion PUNTO ID PARIZQ listaExpresiones PARDER   { $$ = new accederAFunciones($1,$3,$5,@1.first_line,@1.first_column); }


          
          

          
          ;



//#########################################################################################
//################################# LISTA EXPRESIONES #####################################
//#######################################################################################
listaExpresiones: listaExpresiones COMA expresion                            { $$ = $1; $$.push($3); }
                | expresion                                                  { $$ = []; $$.push($1); }
                ;


//#########################################################################################
//################################# ARITMETICAS #####################################
//#######################################################################################
aritmetica : expresion MAS expresion                                                { $$ = new Aritmetica($1,$3,Operacion.SUMA,@1.first_line,@1.first_column);}
           | expresion MENOS expresion                                              { $$ = new Aritmetica($1,$3,Operacion.RESTA,@1.first_line,@1.first_column);}
           | expresion MULTIPLICACION expresion                                     { $$ = new Aritmetica($1,$3,Operacion.MULTIPLICACION,@1.first_line,@1.first_column);}
           | expresion DIVISION expresion                                           { $$ = new Aritmetica($1,$3,Operacion.DIVISION,@1.first_line,@1.first_column);}
           | POW PARIZQ expresion COMA expresion PARDER                             { $$ = new Aritmetica($3,$5,Operacion.POTENCIA,@1.first_line,@1.first_column);}
           ;
//#########################################################################################
//################################# RELACIONALES #####################################
//#######################################################################################

relacional : expresion MENOR expresion                                                  { $$ = new Relacional($1,$3,"<",@1.first_line,@1.first_column); }
           | expresion MAYOR expresion                                                  { $$ = new Relacional($1,$3,">",@1.first_line,@1.first_column); }
           | expresion MENORIGUAL expresion                                             { $$ = new Relacional($1,$3,"<=",@1.first_line,@1.first_column); }
           | expresion MAYORIGUAL expresion                                             { $$ = new Relacional($1,$3,">=",@1.first_line,@1.first_column); }
           | expresion IGUALIGUAL expresion                                             { $$ = new Relacional($1,$3,"==",@1.first_line,@1.first_column); }
           | expresion DIFERENTE expresion                                              { $$ = new Relacional($1,$3,"!=",@1.first_line,@1.first_column); }
           ;
//#########################################################################################
//################################# LOGICAS #####################################
//#######################################################################################
logica : expresion OR expresion                                                          { $$ = new Logica($1,$3,Operacion.OR,@1.first_line,@1.first_column); }
       | expresion AND expresion                                                         { $$ = new Logica($1,$3,Operacion.AND,@1.first_line,@1.first_column); }
       |           NEGACION expresion                                                    { $$ = new Logica($2,null,Operacion.NEGACION,@1.first_line,@1.first_column); }
       |           MENOS expresion %prec UMENOS                                          { $$ = new Unaria($2,Operacion.NEGATIVO,@1.first_line,@1.first_column); }

       ;

//#########################################################################################
//################################# UNARIAS #####################################
//#######################################################################################
unaria : INCREMENTO expresion                                           { $$ = new Unaria($2,Operacion.INCREMENTOPRE,@1.first_line,@1.first_column); }
       | DECREMENTO expresion                                           { $$ = new Unaria($2,Operacion.DECREMENTOPRE,@1.first_line,@1.first_column); }
       | expresion INCREMENTO                                           { $$ = new Unaria($1,Operacion.INCREMENTOPOS,@1.first_line,@1.first_column); }
       | expresion DECREMENTO                                           { $$ = new Unaria($1,Operacion.DECREMENTOPOS,@1.first_line,@1.first_column); }
       ;

//#########################################################################################
//################################# TERNARIO #####################################
//#######################################################################################
ternario : PARIZQ expresion PARDER TERNARIO expresion DSPUNTOS expresion                { $$ = new Ternario($2,$5,$7,@1.first_line,@1.first_column); }
         ;
//#########################################################################################
//################################# CASTEO EXPLICITO #####################################
//#######################################################################################
casteo : PARIZQ tipo PARDER expresion                                               { $$ = new Casteo($2.tipo,$2.valor,$4,@1.first_line,@1.first_column); }
       ;                                          

//#########################################################################################
//###################################### STR #############################################
//#######################################################################################
str_statement : STR PARIZQ expresion PARDER                                         { $$ = new Str($3,@1.first_line,@1.first_column); }
              ;


//#########################################################################################
//###################################### TOINT | TO DOUBLE ###############################
//#######################################################################################
toint_statement : TOINT PARIZQ expresion PARDER                                         { $$ = new toInt($3,true,@1.first_line,@1.first_column); }
                | TODOUBLE PARIZQ expresion PARDER                                      { $$ = new toInt($3,false,@1.first_line,@1.first_column); }
                ;

//#########################################################################################
//################################# DATOS PRIMITIVOS #####################################
//#######################################################################################
primitivo : ENTERO                  {$$ = new Primitivo(Tipo.INT,$1,@1.first_line,@1.first_column);}
          | DECIMAL                 {$$ = new Primitivo(Tipo.DOUBLE,$1,@1.first_line,@1.first_column);}
          | CARACTER                {$$ = new Primitivo(Tipo.CHAR,$1,@1.first_line,@1.first_column);}
          | CADENA                  {$$ = new Primitivo(Tipo.STRING,$1,@1.first_line,@1.first_column);}
          | ID                      {$$ = new Primitivo(Tipo.ID,$1,@1.first_line,@1.first_column);}
          | TRUE                    {$$ = new Primitivo(Tipo.BOOLEAN,"1",@1.first_line,@1.first_column)}
          | FALSE                   {$$ = new Primitivo(Tipo.BOOLEAN,"0",@1.first_line,@1.first_column)}
          | NULL                    {$$ = new Primitivo(Tipo.NULL,"",@1.first_line,@1.first_column); }
          ;  
//#########################################################################################
//################################# PRINT | PRINTLN #####################################
//#######################################################################################
print_statement : PRINT PARIZQ expresion PARDER                     { $$ = []; $$.push(new PrintlOLCEV($3,false,@1.first_line,@1.first_column)); }
                | PRINTLN PARIZQ expresion PARDER                   { $$ = []; $$.push(new PrintlOLCEV($3,true,@1.first_line,@1.first_column)); }
                ;
//#########################################################################################
//################################# IF SUPERIOR #####################################
//#######################################################################################
if_superior : if_sentence                                           { $$ = []; $$.push($1); $$ = new If_Superior($$); }
            | if_sentence elseif_sup                                { $$ = []; $$.push($1); $$ = $$.concat($2); $$ = new If_Superior($$); }
            | if_sentence elseif_sup else_sentence                  { $$ = []; $$.push($1); $$ = $$.concat($2); $$.push($3); $$ = new If_Superior($$); }
            | if_sentence else_sentence                             { $$ = []; $$.push($1); $$.push($2); $$ = new If_Superior($$); }
            ;

//#########################################################################################
//################################# IF #####################################
//#######################################################################################
if_sentence : IF expresion LLAVEIZQ instrucciones LLAVEDER                  { $$ = new If($2,$4,@1.first_line,@1.first_column); }
            ;
//#########################################################################################
//################################# ELSE IF #####################################
//#######################################################################################
elseif_sup : elseif_sup elseif_sentence                             { $$ = $1; $$.push($2); }
           | elseif_sentence                                        { $$ = []; $$.push($1); }
           ;


elseif_sentence : ELSE IF expresion LLAVEIZQ instrucciones LLAVEDER         { $$ = new If($3,$5,@1.first_line,@1.first_column); }
                ;

//#########################################################################################
//################################# ELSE #####################################
//#######################################################################################
else_sentence : ELSE LLAVEIZQ instrucciones LLAVEDER                      { $$ = new If(null,$3,@1.first_line,@1.first_column); }
              ;

//#########################################################################################
//################################# SWITCH #####################################
//#######################################################################################
switch_statement : SWITCH PARIZQ expresion PARDER LLAVEIZQ listaCase default_statement LLAVEDER                             { $6.push($7); $$ = new Switch($3,$6); }
                 | SWITCH PARIZQ expresion PARDER LLAVEIZQ listaCase LLAVEDER                                               { $ = new Switch($3,$6); }
                 ;

//#########################################################################################
//################################# CASE  #####################################
//#######################################################################################
listaCase : listaCase case_statement                                        { $$ = $1; $$.push($2); }
          | case_statement                                                  { $$ = []; $$.push($1); }
          ;

case_statement : CASE expresion DSPUNTOS instrucciones                      { $$ = new Case($2,$4,@1.first_line,@1.first_column); }
               ;

//#########################################################################################
//################################# DEFAULT #####################################
//#######################################################################################
default_statement : DEFAULT DSPUNTOS instrucciones                          { $$ = new Case(null,$3,@1.first_line,@1.first_column); }
                  ;

//#########################################################################################
//################################# BREAK #####################################
//#######################################################################################
break_statement : BREAK                                             { $$ = new Break(); }
                ;


//#########################################################################################
//################################# WHILE #####################################
//#######################################################################################
while_statement : WHILE expresion LLAVEIZQ instrucciones LLAVEDER                           { $$ = new While($2,$4,@1.first_line,@1.first_column); }
                ;
//#########################################################################################
//################################# CONTINUE #####################################
//#######################################################################################
continue_statement : CONTINUE                                                   { $$ = new Continue(); }
                   ;

//#########################################################################################
//################################# DO WHILE #####################################
//#######################################################################################
dowhile_statement : DO LLAVEIZQ instrucciones LLAVEDER WHILE PARIZQ expresion PARDER                { $$ = new DoWhile($7,$3,@1.first_line,@1.first_column); }
                  ;

//#########################################################################################
//################################# FOR #####################################
//#######################################################################################
for_statement : FOR PARIZQ declaracionLocal PNTCOMA expresion PNTCOMA expresion PARDER LLAVEIZQ instrucciones LLAVEDER                { $$ = new For($3,$5,$7,$10,@1.first_line,@1.first_column); }
              ;
//#########################################################################################
//################################# ARREGLO #####################################
//#######################################################################################
arreglo_statement : NEW tipo listaDimensiones                                { $$ = new crearArreglo($2.tipo,$2.valor,$3,@1.first_line,@1.first_column);}
                  ;

//#########################################################################################
//################################# LISTA DIMENSIONES #####################################
//#######################################################################################
listaDimensiones : listaDimensiones CORIZQ expresion CORDER                         { $$ = $1; $$.push($3); }
                 | CORIZQ expresion CORDER                                          { $$ = []; $$.push($2); }
                 ;

//#########################################################################################
//################################# FUNCIONES Y METODOS #####################################
//#######################################################################################

funcion_statement : modificador VOID ID parametros_sentence LLAVEIZQ instrucciones LLAVEDER                                   { $$ = new FuncionOLCEV($3,$1,0,Tipo.VOID,"",$6,$4,@1.first_line,@1.first_column,0);  }
                  | VOID ID parametros_sentence LLAVEIZQ instrucciones LLAVEDER                                               { $$ = new FuncionOLCEV($2,null,0,Tipo.VOID,"",$5,$3,@1.first_line,@1.first_column,0);  }
                  | modificador tipo ID parametros_sentence LLAVEIZQ instrucciones LLAVEDER                                   { $$ = new FuncionOLCEV($3,$1,0,$2.tipo,$2.valor,$6,$4,@1.first_line,@1.first_column,0);}
                  | tipo ID parametros_sentence LLAVEIZQ instrucciones LLAVEDER                                               { $$ = new FuncionOLCEV($2,null,0,$1.tipo,$1.valor,$5,$3,@1.first_line,@1.first_column,0);}
                  | modificador tipo listaArreglo ID parametros_sentence LLAVEIZQ instrucciones LLAVEDER                      {$$ = new FuncionOLCEV($4,$1,$3,$2.tipo,$2.valor,$7,$5,@1.first_line,@1.first_column,0); }
                  | tipo listaArreglo ID parametros_sentence LLAVEIZQ instrucciones LLAVEDER                                  {$$ = new FuncionOLCEV($3,null,$2,$1.tipo,$1.valor,$6,$4,@1.first_line,@1.first_column,0); }
                  | ID ID parametros_sentence LLAVEIZQ instrucciones LLAVEDER                                                 { $$ = new FuncionOLCEV($2,null,0,Tipo.ID,$1,$5,$3,@1.first_line,@1.first_column,0);}
                  | modificador ID ID parametros_sentence LLAVEIZQ instrucciones LLAVEDER                                     {$$ = new FuncionOLCEV($3,$1,0,Tipo.ID,$2,$6,$4,@1.first_line,@1.first_column,0); }
                  ;


parametros_sentence: PARIZQ listaParametros PARDER                                { $$ = $2; }
                   | PARIZQ PARDER                                                { $$ = []; }
                   ;

listaParametros: listaParametros COMA parametro                                  { $$ = $1; $$.push($3); }
               | parametro                                                       { $$ = []; $$.push($1); }
               ;

parametro: tipo ID                                                               { $$ = new Declaracion($2,null,$1.tipo,$1.valor,@1.first_line,@1.first_column); }
         | tipo listaArreglo ID                                                  { $$ = new Declaracion($3,null,Tipo.ARREGLO, new Arreglo($1.tipo,$1.valor),@1.first_line,@1.first_column,$2); }   
         | ID ID                                                                 { $$ = new Declaracion($2,null,Tipo.ID,$1,@1.first_line,@1.first_column,$2); }                              
         ;

//#########################################################################################
//################################# LLAMAR FUNCIONES #####################################
//#######################################################################################
call_function : ID PARIZQ PARDER                                                { $$ = new llamarFunciones($1,null,[],@1.first_line,@1.first_column); }
              | ID PARIZQ listaExpresiones PARDER                               { $$ = new llamarFunciones($1,null,$3,@1.first_line,@1.first_column); }
              ;



//#########################################################################################
//################################# RETURN #####################################
//#######################################################################################
return_statement : RETURN expresion                                             { $$ = new Return($2,@1.first_line,@1.first_column); }
                 ;

%%



parser.arbol ={
    raiz: null
};