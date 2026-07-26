// ==========================================================================
// 1. BASE DE DATOS DE STOCK RÍGIDO (PLACAS COMERCIALES)
// ==========================================================================
const BASE_MATERIALES = {
    "pvc-3": { nombre: "PVC Espumado 3mm", anchoPlaca: 122, altoPlaca: 244, costoPlaca: 45.00 },
    "pvc-5": { nombre: "PVC Espumado 5mm", anchoPlaca: 122, altoPlaca: 244, costoPlaca: 65.00 },
    "alto-impacto": { nombre: "Alto Impacto 2mm", anchoPlaca: 100, altoPlaca: 200, costoPlaca: 35.00 },
    "mdf-5": { nombre: "MDF 5mm", anchoPlaca: 183, altoPlaca: 260, costoPlaca: 28.00 },
    "corrugado": { nombre: "Corrugado Plástico 4mm", anchoPlaca: 100, altoPlaca: 120, costoPlaca: 12.00 }
};

const COSTO_TINTA_M2 = 8.50; 
const COSTO_CNC_M2 = 12.00;   

// ==========================================================================
// 2. CAPTURA DE COMPONENTES DE INTERFAZ
// ==========================================================================
const form = document.getElementById('form-presupuesto');
const placeholder = document.getElementById('placeholder-texto');
const desglose = document.getElementById('desglose-contenido');
const graficoCostos = document.getElementById('grafico-costos');

// Inputs
const inputMaterial = document.getElementById('material');
const inputAncho = document.getElementById('ancho');
const inputAlto = document.getElementById('alto');
const inputCantidad = document.getElementById('cantidad');
const checkCnc = document.getElementById('requiere-cnc');
const inputMerma = document.getElementById('merma');
const inputMargen = document.getElementById('margen');

// Outputs
const resPrecioVenta = document.getElementById('res-precio-venta');
const resSuperficie = document.getElementById('res-superficie');
const resPlacasReales = document.getElementById('res-placas-reales');
const resCostoMaterial = document.getElementById('res-costo-material');
const resCostoTinta = document.getElementById('res-costo-tinta');
const resCostoCnc = document.getElementById('res-costo-cnc');
const resImpactoMerma = document.getElementById('res-impacto-merma');
const resCostoProduccion = document.getElementById('res-costo-produccion');

const btnExportar = document.getElementById('btn-exportar');
const btnLimpiar = document.getElementById('btn-limpiar');

// ==========================================================================
// 3. PERSISTENCIA EN LOCALSTORAGE (RECUPERAR VARIABLES)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('mermaPredefinida')) {
        inputMerma.value = localStorage.getItem('mermaPredefinida');
    } else {
        inputMerma.value = 10; // Default inicial
    }

    if (localStorage.getItem('margenPredefinido')) {
        inputMargen.value = localStorage.getItem('margenPredefinido');
    } else {
        inputMargen.value = 50; // Default inicial
    }
});

// ==========================================================================
// 4. MOTOR LÓGICO DE CÁLCULOS
// ==========================================================================
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const materialSeleccionado = inputMaterial.value;
    const anchoPieza = parseFloat(inputAncho.value);
    const altoPieza = parseFloat(inputAlto.value);
    const cantidad = parseInt(inputCantidad.value);
    const requiereCnc = checkCnc.checked;
    const porcentajeMerma = parseFloat(inputMerma.value) || 0;
    const porcentajeMargen = parseFloat(inputMargen.value) || 0;

    if (!materialSeleccionado) return;

    // Guardar configuraciones en localStorage para futuros accesos
    localStorage.setItem('mermaPredefinida', porcentajeMerma);
    localStorage.setItem('margenPredefinido', porcentajeMargen);

    const infoMat = BASE_MATERIALES[materialSeleccionado];

    // --- Métricas Geométricas ---
    const superficiePiezaM2 = (anchoPieza * altoPieza) / 10000;
    const superficieTotalNetaM2 = superficiePiezaM2 * cantidad;
    
    const superficiePlacaM2 = (infoMat.anchoPlaca * infoMat.altoPlaca) / 10000;
    const costoPorM2Material = infoMat.costoPlaca / superficiePlacaM2;

    // --- ALGORITMO DE CUBICAJE DE STOCK REAL ---
    // Multiplicamos por la merma física estimada para entender el impacto en planchas reales
    const superficieConDesperdicioFisico = superficieTotalNetaM2 * (1 + (porcentajeMerma / 100));
    const cantidadPlacasReales = Math.ceil(superficieConDesperdicioFisico / superficiePlacaM2);

    // --- Estructura Financiera de Costos ---
    const costoMaterialNeto = superficieTotalNetaM2 * costoPorM2Material;
    const costoTintaNeto = superficieTotalNetaM2 * COSTO_TINTA_M2;
    const costoCncNeto = requiereCnc ? (superficieTotalNetaM2 * COSTO_CNC_M2) : 0;

    const costoBaseDirecto = costoMaterialNeto + costoTintaNeto + costoCncNeto;

    // Lógica Industrial de Merma Corregida (Impacto sobre el precio neto comercial)
    const costoImpactoMerma = costoBaseDirecto * (porcentajeMerma / 100);
    const costoProduccionTotal = costoBaseDirecto + costoImpactoMerma;

    // Margen comercial final
    const precioVentaFinal = costoProduccionTotal * (1 + (porcentajeMargen / 100));

    // --- CALCULO DE PORCENTAJES PARA GRÁFICO DIÁGRAMA ---
    const pMaterial = (costoMaterialNeto / costoProduccionTotal) * 100;
    const pTinta = (costoTintaNeto / costoProduccionTotal) * 100;
    const pCnc = (costoCncNeto / costoProduccionTotal) * 100;

    // Inyección de variables dinámicas al conic-gradient CSS
    const limite1 = pMaterial;
    const limite2 = pMaterial + pTinta;
    const limite3 = pMaterial + pTinta + pCnc;

    graficoCostos.style.setProperty('--p1', `${limite1}%`);
    graficoCostos.style.setProperty('--p2', `${limite2}%`);
    graficoCostos.style.setProperty('--p3', `${limite3}%`);

    // --- RENDERIZADO EFICIENTE DE RESULTADOS ---
    placeholder.classList.add('oculto');
    desglose.classList.remove('oculto');
    desglose.classList.add('animate-fade-in');

    resSuperficie.innerText = `${superficieTotalNetaM2.toFixed(3)} m²`;
    resPlacasReales.innerText = `${cantidadPlacasReales} ${cantidadPlacasReales === 1 ? 'Placa' : 'Placas'} (${infoMat.anchoPlaca/100}x${infoMat.altoPlaca/100}m)`;
    
    resCostoMaterial.innerText = `$ ${costoMaterialNeto.toFixed(2)}`;
    resCostoTinta.innerText = `$ ${costoTintaNeto.toFixed(2)}`;
    resCostoCnc.innerText = `$ ${costoCncNeto.toFixed(2)}`;
    resImpactoMerma.innerText = `$ ${costoImpactoMerma.toFixed(2)}`;
    resCostoProduccion.innerText = `$ ${costoProduccionTotal.toFixed(2)}`;
    
    resPrecioVenta.innerText = `$ ${precioVentaFinal.toFixed(2)}`;
});

// ==========================================================================
// 5. COMPORTAMIENTO DE ACCIONES (EXPORTAR Y REINICIAR)
// ==========================================================================
if (btnExportar) {
    btnExportar.addEventListener('click', () => {
        const materialNombre = inputMaterial.options[inputMaterial.selectedIndex].text;
        const ancho = inputAncho.value;
        const alto = inputAlto.value;
        const cant = inputCantidad.value;
        const total = resPrecioVenta.innerText;
        const m2 = resSuperficie.innerText;
        const placas = resPlacasReales.innerText;

        const textoCotizacion = `🛠️ *PRESUPUESTO DE IMPRESIÓN INDUSTRIAL*\n` +
                                `----------------------------------------\n` +
                                `📦 *Soporte:* ${materialNombre}\n` +
                                `📐 *Medida Pieza:* ${ancho} x ${alto} cm\n` +
                                `🔢 *Volumen:* ${cant} unidad(es)\n` +
                                `📊 *Superficie Operativa:* ${m2}\n` +
                                `🚚 *Cubicaje en Stock:* ${placas}\n` +
                                `----------------------------------------\n` +
                                `💰 *VALOR DE VENTA:* ${total}\n\n` +
                                `_Reporte analítico emitido por Propulsor Sistema._`;

        navigator.clipboard.writeText(textoCotizacion).then(() => {
            const textoOriginal = btnExportar.innerText;
            btnExportar.innerText = '¡Copiado con Éxito!';
            btnExportar.style.borderColor = '#00ff66';
            btnExportar.style.color = '#00ff66';

            setTimeout(() => {
                btnExportar.innerText = textoOriginal;
                btnExportar.style.borderColor = 'var(--color-acento)';
                btnExportar.style.color = 'var(--color-acento)';
            }, 2000);
        }).catch(err => console.error('Error de portapapeles: ', err));
    });
}

if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
        form.reset();
        desglose.classList.add('oculto');
        placeholder.classList.remove('oculto');
        // Restablecemos los valores persistidos de forma manual para evitar borrar la preferencia del usuario
        if (localStorage.getItem('mermaPredefinida')) inputMerma.value = localStorage.getItem('mermaPredefinida');
        if (localStorage.getItem('margenPredefinido')) inputMargen.value = localStorage.getItem('margenPredefinido');
    });
}