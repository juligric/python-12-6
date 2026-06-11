import base_de_datos as bd

print("--- PRODUCTOS ---")
for p in bd.listar_productos():
    print(p.nombre_plato, "-", p.categoria, "- $", p.precio, "- con IVA: $", p.precio_con_iva())
    print("   ¿es frío?:", p.es_frio())
    