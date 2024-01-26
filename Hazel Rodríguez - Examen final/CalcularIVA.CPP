#include <iostream>
#include <cmath>


using namespace std;

int main(){
    
    //Precio producto, IVA 13% ==> precio final 

    float precio(0.0); 
    float IVA = 0.13;
    float PrecioTotal = (precio*IVA);
    float impuesto; 


    cout << "Bienbenido al programa para calcular el IVA " <<endl;
    cout <<"Ingrese el precio del producto: $";
    cin>>precio;
    impuesto=round(precio*IVA);
    cout<<"\nEl IVA a pagar es: $"<<impuesto<<endl;
    PrecioTotal=impuesto+precio;
    cout<<"El precio total es: $" <<PrecioTotal<<endl;

    return 0;
}