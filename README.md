# IoT en los servicios públicos de Pasto

Presentación interactiva para el curso **Computación Ubicua** de la Universidad Cooperativa de Colombia, sede Pasto. Trata la telemetría y la telemedida de agua, luz y gas en Colombia, Nariño y Pasto.

## Cómo verla

Hay dos formas, y ninguna necesita internet ni instalar nada:

- **Doble clic** en `index.html`.
- **En VS Code:** clic derecho en `index.html` y luego *Open with Live Server*.

Está probada en Chrome. Cada movimiento de la rueda del mouse pasa a la diapositiva siguiente, con una animación leve de parallax.

## Controles

| Acción | Cómo |
| --- | --- |
| Siguiente o anterior | Rueda del mouse, flechas o barra espaciadora |
| Índice de diapositivas | Tecla `I` |
| Pantalla completa | Tecla `F` |
| Quitar o devolver las animaciones | Tecla `A` |
| Primera o última | `Inicio` o `Fin` |

En el celular las diapositivas se recorren deslizando hacia arriba.

## Cómo está organizado

```text
index.html                 Estructura y texto de las 15 diapositivas,
css/
  estilos.css              Punto de entrada: importa los demás en orden
  fuentes.css              Letra e íconos locales
  base.css                 Colores, reinicio y tipografía
  componentes.css          Piezas compartidas: marcos, botones, objetos 3D
  interfaz.css             Barra inferior e índice
  diapositivas/            Un archivo por diapositiva
  responsive.css           Ventanas angostas y celular
  movimiento.css           Modo sin animaciones
js/
  nucleo.js                Estado y utilidades compartidas
  interfaz.js              Barra inferior, índice y botones
  navegacion.js            Transiciones, parallax, rueda y teclado
  diapositivas/            Lo interactivo de cada diapositiva
  arranque.js              Inicia la presentación
assets/
  objetos-3d/              Los 21 objetos en PNG con fondo transparente
  fuentes/                 Exo 2 y Material Symbols
  vendor/                  GSAP 3.12.5
docs/
  verificacion-de-datos.md Qué se revisó, qué se corrigió y las fuentes
```

Para cambiar un **texto**, edita `index.html`. Para cambiar el **aspecto** o el **comportamiento** de una diapositiva, busca el archivo con su número en `css/diapositivas/` o `js/diapositivas/`. Las diapositivas 10 y 14 no tienen archivo en `js/` porque no llevan código propio.

El texto sigue en `index.html` porque, al abrir con doble clic, el navegador no deja cargar otros archivos HTML. Los scripts son clásicos y no módulos por la misma razón.

## Animaciones

Las animaciones siempre arrancan activas. La presentación no usa `prefers-reduced-motion` porque Windows lo activa cuando los efectos visuales están apagados por rendimiento, y eso dejaba la presentación sin ninguna animación. Quien necesite verla sin movimiento puede apagarlas con la tecla `A` o con el botón de la barra inferior, y la preferencia se recuerda.

## Contenido

**Cómo funciona**

1. IoT en los servicios públicos
2. Telemetría, telemedida y telecontrol
3. El viaje de una lectura por OSI y TCP/IP
4. Medios de transmisión y señales inalámbricas
5. Del gateway al centro de control

**Los servicios en el territorio**

6. Colombia ya tiene norma y meta
7. Luz: medición inteligente y el caso CEDENAR
8. Agua: telemetría de la fuente al grifo
9. Gas: el caso único de Pasto
10. Los tres servicios, lado a lado

**Inteligencia y propuesta**

11. IA: de datos a decisiones
12. Una red, muchos servicios
13. Propuesta: partir del proyecto MIA, del Acueducto de Bogotá
14. Retos y cómo se manejan
15. Conclusiones

Varias diapositivas tienen elementos para tocar durante la exposición: AMR frente a AMI, el recorrido de una lectura por las capas, el selector de tecnologías, la orden de corte, la conexión ilegal, la fuga de las 3 a. m., el cierre de la vía Panamericana, la detección de anomalías y las 4 capas de MIA.

Las fuentes de cada dato están en [docs/verificacion-de-datos.md](docs/verificacion-de-datos.md).

## Objetos 3D

La carpeta `assets/objetos-3d` tiene los objetos que usa la presentación, en PNG con fondo transparente, por si quieren reutilizarlos en otro documento o en PowerPoint.
