# Script de una sola corrida: importa data/productos.csv a la tabla productos.
# Uso: python importar_csv.py

import base_de_datos as bd

if __name__ == "__main__":
    cantidad = bd.importar_productos_desde_csv("data/productos.csv")
    print(f"Se importaron {cantidad} productos desde el CSV.")
