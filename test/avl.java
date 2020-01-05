




public class NodoAVL {
    NodoAVL izquierda; 
    NodoAVL derecha;
    int altura;
    int valor;

    public NodoAVL(int valor) {
        izquierda = null;
        derecha = null;
        altura = 0;
        this.valor = valor;
    }

    public NodoAVL() {
        izquierda = null;
        derecha = null;
        altura = 0;
        valor = 0;
    }

    public NodoAVL getIzquierda() {
        return izquierda;
    }

    public void setIzquierda(NodoAVL izquierda) {
        this.izquierda = izquierda;
    }

    public NodoAVL getDerecha() {
        return derecha;
    }

    public void setDerecha(NodoAVL derecha) {
        this.derecha = derecha;
    }

    public int getAltura() {
        return altura;
    }

    public void setAltura(int altura) {
        this.altura = altura;
    }

	public void setValor(int valor){
        this.valor = valor;
    }

    public int getValor(){
        return this.valor;
    }
    
}


public class ArbolAVL {
    public static String avlAux;
    private NodoAVL raiz;

    // Constructor
    public ArbolAVL() {
        raiz = null;
    }
    
    // Verifica si esta vacio el arbol.
    public boolean esVacio(){
        return raiz == null;
    }
    
    public void vaciar(){
        raiz = null;
    }
    
    // Inserta la info en los nodos.
    public void insertar(int valor){
        raiz = insertar(valor, raiz);
    }
    
    // Obtiene la altura del nodo.
    private int altura(NodoAVL t){
        return (t == null) ? -1 : t.getAltura();
    }
    
    // Maximo del nodo izq/der.
    private int max(int lhs, int rhs){
        return (lhs > rhs) ? lhs : rhs;
    }
    
    // Factor de equilibrio
    private int getFactorEquilibrio(NodoAVL t) {
    	if(t == null) {
    		return 0;
    	}else {
    		return altura(t.getIzquierda())-altura(t.getDerecha());
    	}
    }
    
    // Inserta info en nodos, recursivamente.
    private NodoAVL insertar(int valor, NodoAVL t){
    	println("Insertando");
        if(t == null){
            t = new NodoAVL(valor);
//            System.out.println("Arbol vacio, insertando en la raiz.");
        }else if(valor < t.getValor()){
//        	System.out.println("Insertando en la izquierda.");
            t.setIzquierda(insertar(valor, t.getIzquierda()));
            if(getFactorEquilibrio(t) == 2){
                if(valor < t.getValor()){
                	// CASO 1: Izquierda-izquierda
                    t = rotarConHijoIzq(t);
                }else{
                	// CASO 2: Izquierda-derecha
                    t = rotarDobleConHijoIzq(t);
                }
            }
            
        }else if(valor > t.getValor()){
//        	System.out.println("Insertando en la derecha.");
            t.setDerecha(insertar(valor, t.getDerecha()));
            if(getFactorEquilibrio(t) == 2){
                if(valor > t.getValor()){
                	// CASO 3: Derecha-derecha
                    t = rotarConHijoDer(t);
                }else{
                	// CASO 4: Derecha-izquierda
                    t = rotarDobleConHijoDer(t);
                }
            }
            
        }else{
            // Duplicado; no hace nada.
            println("Valor duplicado.");
        }
        t.setAltura(max(altura(t.getIzquierda()), altura(t.getDerecha())) + 1);
        return t;
    }
    
    // Rotacion del arbol binario con un hijo izquierdo.
    private NodoAVL rotarConHijoIzq(NodoAVL k2){
        NodoAVL k1 = k2.getIzquierda();
        k2.setIzquierda(k1.getDerecha());
        k1.setDerecha(k2);
        k2.setAltura(max(altura(k2.getIzquierda()), altura(k2.getDerecha()))+1);
        k1.setAltura(max(altura(k1.getIzquierda()), k2.getAltura())+1);
        
        return k1;
    }
    
    // Rotacion del arbol binario con un hijo derecho.
    private NodoAVL rotarConHijoDer(NodoAVL k1){
        NodoAVL k2 = k1.getDerecha();
        k1.setDerecha(k2.getIzquierda());
        k2.setIzquierda(k1);
        k1.setAltura(max(altura(k1.getIzquierda()), altura(k1.getDerecha()))+1);
        k2.setAltura(max(altura(k2.getDerecha()), k1.getAltura())+1);
        
        return k2;
    }
    
    // Doble rotacion de un nodo del arbo binario: Primero el hijo izquierdo
    // con su hijo derecho; luego el nodo k3 con su nuevo hijo izquierdo.
    private NodoAVL rotarDobleConHijoIzq(NodoAVL k3){
        k3.setIzquierda(rotarConHijoDer(k3.getIzquierda()));
        return rotarConHijoIzq(k3);
    }
    
    // Doble rotacion de un nodo del arbo binario: Primero el hijo derecho
    // con su hijo izquierdo; luego el nodo k1 con su nuevo hijo derecho.
    private NodoAVL rotarDobleConHijoDer(NodoAVL k1){
        k1.setDerecha(rotarConHijoIzq(k1.getDerecha()));
        return rotarConHijoDer(k1);
    }
    
    // Devuelve el numero de nodos
    public int contarNodos(){
        return contarNodos(raiz);
    }
    
    // Contar nodos, recursivamente.
    private int contarNodos(NodoAVL r){
        if(r == null){
            return 0;
        }else{
            int l = 1;
            l = l + contarNodos(r.getIzquierda());
            l = l + contarNodos(r.getDerecha());
            return l;
        }
    }
    
    // Buscar un elemento.
    public boolean buscar(int codigo){
        return buscar(raiz, codigo);
    }
    
    // Buscar, recursivamente.
    private boolean buscar(NodoAVL r, int valor){
        boolean encontrado = false;
        while((r != null) && ! encontrado)        {
            if(valor < r.getValor()){
                r = r.getIzquierda();
            }else if(valor > r.getValor()){
                r = r.getDerecha();
            }else{
                encontrado = true;
                break;
            }
            encontrado = buscar(r, valor);
        }
        
        return encontrado;
    }
    
    // Eliminar nodo
    public void eliminar(int valor) {
    	raiz = eliminar(valor, raiz);
    }
    
    private NodoAVL eliminar(int valor, NodoAVL t) {
    	if(t == null) {
    		return t;
    	}
    	if(valor < t.getValor()) {
    		t.setIzquierda(eliminar(valor, t.getIzquierda()));
    	} else if(valor > t.getValor()) {
    		t.setDerecha(eliminar(valor, t.getDerecha()));
    	}else {
    		if(t.getIzquierda() == null || t.getDerecha() == null) {
    			NodoAVL temp = null;
    			if(temp.getValor() == t.getIzquierda().getValor()) {
    				temp = t.getDerecha();
    			}else {
    				temp = t.getIzquierda();
    			}
    			
    			if(temp == null) {
    				temp = t;
    				t = null;
    			}else {
    				t = temp;
    			}
    		}else {
    			NodoAVL temp = sucesor(t.getDerecha());
    			t.setValor(valor);
    			t.setDerecha(eliminar(temp.getValor(), t.getDerecha()));
    		}
    	}
    	
    	if(t == null) {
    		return t;
    	}
    	
    	t.setAltura(max(altura(t.getIzquierda()), altura(t.getDerecha())));
    	int balance = getFactorEquilibrio(t);
    	
    	// CASO 1: Izquierda-izquierda
    	if(balance > 1 && getFactorEquilibrio(t.getIzquierda()) >= 0) {
    		return rotarConHijoDer(t);
    	}
    	// CASO 2: Izquierda-derecha
    	if(balance > 1 && getFactorEquilibrio(t.getIzquierda()) < 0) {
    		t.setIzquierda(rotarConHijoIzq(t.getIzquierda()));
    		return rotarConHijoDer(t);
    	}
    	// CASO 3: Derecha-derecha
    	if(balance < -1 && getFactorEquilibrio(t.getDerecha()) <= 0) {
    		return rotarConHijoIzq(t);
    	}
    	// CASO 4: Derecha-izquierda
    	if(balance < -1 && getFactorEquilibrio(t.getDerecha()) > 0) {
    		t.setDerecha(rotarConHijoDer(t.getDerecha()));
    		return rotarConHijoIzq(t);
    	}
    	
    	return t;
	}
    
    // Nodo sucesor
    private NodoAVL sucesor(NodoAVL t) {
    	NodoAVL aux = t;
    	while(aux.getIzquierda() != null) {
    		aux = aux.getIzquierda();
    	}
    	return aux;
    }
    
    // Editar
   
	boolean esRaiz; 
  boolean esIzquierdo;
    // Buscar nodo
    private NodoAVL buscarNodo(NodoAVL r, int codigo){
        NodoAVL aux = null;
        while(r != null){
            if(codigo < r.getValor()){
                r = r.getIzquierda();
                println("No se encontro valor"+codigo);
            }else if(codigo > r.getValor()){
                r = r.getDerecha();
                println("No se encontro valor"+codigo);
            }else{
                aux = r;
                println("Se encontro valor"+ aux.getValor());
                break;
            }
            r = buscarNodo(r, codigo);
        }
        return aux;
    }
    
    
    
    
    
    // Recorrer inorder.
    public void inorder(){
        inorder(raiz);
    }
    
   
    
    
    private void inorder(NodoAVL r){
        if(r != null){
            inorder(r.getIzquierda());
            println(r.getValor());
            inorder(r.getDerecha());
        }
    }
    
    
}


class hola{
  
  public hola(){
   
    ArbolAVL avl = new ArbolAVL();
  }
}
