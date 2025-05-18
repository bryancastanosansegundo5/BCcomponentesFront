export const provincias = [
    "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona",
    "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "Cuenca",
    "Girona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Illes Balears", "Jaén",
    "La Coruña", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Murcia",
    "Navarra", "Ourense", "Palencia", "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia",
    "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya",
    "Zamora", "Zaragoza"
  ];

  export const camposBusqueda = [
    { value: "nombre", label: "Nombre" },
    { value: "apellidos", label: "Apellidos" },
    { value: "email", label: "Email" },
    { value: "telefono", label: "Teléfono" },
    { value: "localidad", label: "Localidad" },
    { value: "baja", label: "Estado (Baja)" },
  ];
  export const camposBusquedaProductos = [
    { value: "nombre", label: "Nombre" },
    { value: "stock", label: "Stock" },
    { value: "id", label: "Identificador" },
    { value: "categoria", label: "Categoria" },
    { value: "proveedor", label: "Proveedor" },
    { value: "baja", label: "Estado (Baja)" },

  ];
  export const getColorEstado = (estado) => {
    switch (estado) {
      case "Pago aceptado":
        return "green";
      case "Enviado":
        return "#0d6efd"; // azul Bootstrap
      case "Entregado":
        return "#198754"; // verde Bootstrap
      case "Cancelado":
        return "#dc3545"; // rojo Bootstrap
      default:
        return "#6c757d"; // gris por defecto
    }
  };
  
  export const rangosStock = [
    { label: "Todos", value: "" },
    { label: "0 - 5", value: "0-5" },
    { label: "0 - 10", value: "0-10" },
    { label: "11 - 50", value: "11-50" },
    { label: "Más de 50", value: "50-" },
  ];

  export const imagenesCategorias = [
    {cpu:"/assets/categorias/cpuCategoria.png"},
    {gpu:"/assets/categorias/gpuCategoria.png"},
    {ram:"/assets/categorias/ramCategoria.png"},
    {placa:"/assets/categorias/placaCategoria.png"},
    {fuente:"/assets/categorias/fuenteCategoria.png"},
    {caja:"/assets/categorias/cajaCategoria.png"},   
  ]
  