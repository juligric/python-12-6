# modelos.py
# FASE 2 - Clases (POO)
# Cada clase representa una entidad del negocio y tiene su __init__ + 2 métodos.


class Insumo:
    def __init__(self, id, nombre_insumo, stock_actual, proveedor):
        self.id = id
        self.nombre_insumo = nombre_insumo
        self.stock_actual = stock_actual
        self.proveedor = proveedor

    # Método 1: decide si hay que reponer (stock por debajo de un mínimo)
    def necesita_reposicion(self, minimo=10):
        return self.stock_actual is not None and self.stock_actual < minimo

    # Método 2: una descripción corta lista para mostrar
    def resumen(self):
        estado = "REPONER" if self.necesita_reposicion() else "OK"
        return f"{self.nombre_insumo} - stock {self.stock_actual} ({estado})"


class Productos:
    IVA = 0.21  # IVA argentino (21%)

    def __init__(self, id, nombre_plato, categoria, precio, id_insumo_pricipal):
        self.id = id
        self.nombre_plato = nombre_plato
        self.categoria = categoria
        self.precio = precio
        self.id_insumo_pricipal = id_insumo_pricipal

    # Método 1: calcula el precio final con IVA
    def precio_con_iva(self):
        return round(float(self.precio) * (1 + self.IVA), 2)

    # Método 2: indica si es una bebida fría
    def es_frio(self):
        if self.categoria is None:
            return False
        return self.categoria.lower() in ("bebida fría", "bebida fria", "frío", "frio")


class Baristas:
    def __init__(self, id, nombre, apellido, espcecialidad, turno):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.especialidad = espcecialidad
        self.turno = turno

    # Método 1: nombre y apellido juntos
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"

    # Método 2: indica si trabaja en un turno dado
    def trabaja_de(self, turno):
        return self.turno is not None and self.turno.lower() == turno.lower()
