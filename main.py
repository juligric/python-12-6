from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import base_de_datos as bd

app = FastAPI(title="Brew & Byte Manager")

# Permiso (CORS) para que React, que corre en otro puerto, pueda conectarse.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # para desarrollo; después podés poner la URL exacta de React
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- "Formularios" de entrada: lo que manda React al crear o editar -----
class InsumoIn(BaseModel):
    nombre_insumo: str
    stock_actual: int
    proveedor: str


class ProductoIn(BaseModel):
    nombre_plato: str
    categoria: str
    precio: float
    id_insumo_principal: int


class BaristaIn(BaseModel):
    nombre: str
    apellido: str
    especialidad: str
    turno: str


# ============================== INSUMOS ==============================
@app.get("/insumos")
def get_insumos():
    # vars(objeto) convierte cada objeto en un diccionario con todos sus datos -> JSON
    return [vars(i) for i in bd.listar_insumos()]


@app.post("/insumos")
def post_insumo(datos: InsumoIn):
    bd.crear_insumo(datos.nombre_insumo, datos.stock_actual, datos.proveedor)
    return {"ok": True}


@app.put("/insumos/{id}")
def put_insumo(id: int, datos: InsumoIn):
    bd.actualizar_insumo(id, datos.nombre_insumo, datos.stock_actual, datos.proveedor)
    return {"ok": True}


@app.delete("/insumos/{id}")
def delete_insumo(id: int):
    bd.borrar_insumo(id)
    return {"ok": True}


# ============================== PRODUCTOS ==============================
@app.get("/productos")
def get_productos():
    return [vars(p) for p in bd.listar_productos()]


@app.post("/productos")
def post_producto(datos: ProductoIn):
    bd.crear_producto(datos.nombre_plato, datos.categoria, datos.precio, datos.id_insumo_principal)
    return {"ok": True}


@app.put("/productos/{id}")
def put_producto(id: int, datos: ProductoIn):
    bd.actualizar_producto(id, datos.nombre_plato, datos.categoria, datos.precio, datos.id_insumo_principal)
    return {"ok": True}


@app.delete("/productos/{id}")
def delete_producto(id: int):
    bd.borrar_producto(id)
    return {"ok": True}


# ============================== BARISTAS ==============================
@app.get("/baristas")
def get_baristas():
    return [vars(b) for b in bd.listar_baristas()]


@app.post("/baristas")
def post_barista(datos: BaristaIn):
    bd.crear_barista(datos.nombre, datos.apellido, datos.especialidad, datos.turno)
    return {"ok": True}


@app.put("/baristas/{id}")
def put_barista(id: int, datos: BaristaIn):
    bd.actualizar_barista(id, datos.nombre, datos.apellido, datos.especialidad, datos.turno)
    return {"ok": True}


@app.delete("/baristas/{id}")
def delete_barista(id: int):
    bd.borrar_barista(id)
    return {"ok": True}