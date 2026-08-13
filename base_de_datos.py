import os
import psycopg
import pandas as pd
from dotenv import load_dotenv
from modelos import Insumo, Productos, Baristas

load_dotenv()  # lee tu archivo .env

def conectar():
    url = os.getenv("DATABASE_URL")          # agarra la URL de Neon de tu .env
    return psycopg.connect(url)    



def listar_insumos():
    with conectar() as conn:                 # me conecto a Neon
        with conn.cursor() as cur:           # el "cursor" es por donde mando órdenes
            cur.execute("SELECT id, nombre_insumo, stock_actual, proveedor FROM insumos")
            insumos = []
            for fila in cur.fetchall():      # recorro CADA fila que volvió de la base
                insumos.append(Insumo(*fila))   # y la convierto en un objeto Insumo
            return insumos
        
def crear_insumo(nombre_insumo, stock_actual, proveedor):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO insumos (nombre_insumo, stock_actual, proveedor) VALUES (%s, %s, %s)",
                (nombre_insumo, stock_actual, proveedor),
            )
            conn.commit()                    # guardar de verdad (sin esto no queda nada)

def actualizar_insumo(id, nombre_insumo, stock_actual, proveedor):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE insumos SET nombre_insumo=%s, stock_actual=%s, proveedor=%s WHERE id=%s",
                (nombre_insumo, stock_actual, proveedor, id),
            )
            conn.commit()

def borrar_insumo(id):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM insumos WHERE id=%s", (id,))
            conn.commit()
            

def listar_productos():
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, nombre_plato, categoria, precio, id_insumo_principal FROM productos"
            )
            productos = []
            for fila in cur.fetchall():
                productos.append(Productos(*fila))   # fila -> objeto Productos
            return productos
 
 
def crear_producto(nombre_plato, categoria, precio, id_insumo_principal):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO productos (nombre_plato, categoria, precio, id_insumo_principal) "
                "VALUES (%s, %s, %s, %s)",
                (nombre_plato, categoria, precio, id_insumo_principal),
            )
            conn.commit()
 
 
def actualizar_producto(id, nombre_plato, categoria, precio, id_insumo_principal):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE productos SET nombre_plato=%s, categoria=%s, precio=%s, "
                "id_insumo_principal=%s WHERE id=%s",
                (nombre_plato, categoria, precio, id_insumo_principal, id),
            )
            conn.commit()
 
 
def borrar_producto(id):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM productos WHERE id=%s", (id,))
            conn.commit()


# ------- Importación masiva desde CSV (Parte 2 de la actividad) -------
def importar_productos_desde_csv(ruta_csv="data/productos.csv"):
    # Pandas lee el CSV y arma un DataFrame (una tabla en memoria)
    df = pd.read_csv(ruta_csv)
    for _, fila in df.iterrows():          # recorro el DataFrame fila por fila
        crear_producto(                    # y uso el mismo alta que ya usa el CRUD
            fila["nombre_plato"],
            fila["categoria"],
            float(fila["precio"]),
            int(fila["id_insumo_principal"]),
        )
    return len(df)


# ------- Estadísticas con Pandas (Parte 3 de la actividad) -------
def estadisticas_precios_productos():
    with conectar() as conn:
        df = pd.read_sql("SELECT precio FROM productos", conn)

    return {
        "cantidad": int(df["precio"].count()),
        "media": round(float(df["precio"].mean()), 2),
        "mediana": round(float(df["precio"].median()), 2),
        "moda": [round(float(v), 2) for v in df["precio"].mode().tolist()],
    }

def listar_baristas():
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, nombre, apellido, especialidad, turno FROM baristas"
            )
            baristas = []
            for fila in cur.fetchall():
                baristas.append(Baristas(*fila))     # fila -> objeto Baristas
            return baristas
 
 
def crear_barista(nombre, apellido, especialidad, turno):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO baristas (nombre, apellido, especialidad, turno) "
                "VALUES (%s, %s, %s, %s)",
                (nombre, apellido, especialidad, turno),
            )
            conn.commit()
 
 
def actualizar_barista(id, nombre, apellido, especialidad, turno):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE baristas SET nombre=%s, apellido=%s, especialidad=%s, turno=%s "
                "WHERE id=%s",
                (nombre, apellido, especialidad, turno, id),
            )
            conn.commit()
 
 
def borrar_barista(id):
    with conectar() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM baristas WHERE id=%s", (id,))
            conn.commit() 
         # abre la conexión a la base