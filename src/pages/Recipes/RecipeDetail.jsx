import { useParams, useNavigate } from "react-router-dom";
import "./RecipeDetail.css";

const RECIPE_DETAILS = {
  1: {
    title: "Bowl de Quinoa y Vegetales",
    image: "🥗",
    ingredients: [
      "1 taza de quinoa",
      "1 aguacate",
      "1 zanahoria",
      "1 taza de espinaca"
    ],
    steps: [
      "Cocinar la quinoa durante 15 minutos.",
      "Cortar los vegetales.",
      "Mezclar todo en un bowl.",
      "Agregar aguacate al final."
    ]
  },

  2: {
    title: "Salmón al Horno con Espárragos",
    image: "🐟",
    ingredients: [
      "1 filete de salmón",
      "1 manojo de espárragos",
      "aceite de oliva",
      "sal y pimienta"
    ],
    steps: [
      "Precalentar horno a 180°C.",
      "Colocar el salmón en bandeja.",
      "Agregar espárragos y aceite.",
      "Hornear 20 minutos."
    ]
  },

  3: {
    title: "Tacos de Pollo Saludables",
    image: "🌮",
    ingredients: [
      "2 pechugas de pollo",
      "tortillas integrales",
      "lechuga",
      "tomate"
    ],
    steps: [
      "Cocinar el pollo a la plancha.",
      "Cortar en tiras.",
      "Rellenar tortillas.",
      "Agregar vegetales."
    ]
  },

  4: {
    title: "Smoothie Verde Antioxidante",
    image: "🍹",
    ingredients: [
      "1 taza de espinaca",
      "1 banana",
      "1/2 manzana verde",
      "1 taza de agua o leche vegetal",
      "hielo (opcional)"
    ],
    steps: [
      "Lavar la espinaca y cortar la fruta.",
      "Agregar todos los ingredientes a la licuadora.",
      "Licuar hasta obtener una mezcla suave.",
      "Servir frío y ajustar con más agua/leche si lo deseas."
    ]
  },

  5: {
    title: "Pasta Integral al Pesto",
    image: "🍝",
    ingredients: [
      "250g de pasta integral",
      "1 taza de albahaca fresca",
      "1 diente de ajo",
      "2 cdas de aceite de oliva",
      "2 cdas de queso rallado (opcional)",
      "sal y pimienta"
    ],
    steps: [
      "Cocinar la pasta integral según las instrucciones del paquete.",
      "Procesar albahaca, ajo, aceite, sal y pimienta para hacer el pesto.",
      "Mezclar la pasta cocida con el pesto.",
      "Servir y añadir queso si lo deseas."
    ]
  },

  6: {
    title: "Wrap de Pavo y Aguacate",
    image: "🌯",
    ingredients: [
      "1 tortilla integral grande",
      "100g de pechuga de pavo",
      "1/2 aguacate",
      "lechuga",
      "tomate (opcional)",
      "jugo de limón, sal y pimienta"
    ],
    steps: [
      "Machacar el aguacate con limón, sal y pimienta.",
      "Untar el aguacate sobre la tortilla.",
      "Agregar pavo, lechuga y tomate.",
      "Enrollar el wrap y cortar a la mitad para servir."
    ]
  }
};

const RecipeDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const recipe = RECIPE_DETAILS[id];

  if (!recipe) {
    return <h2 style={{padding:"2rem"}}>Receta no encontrada</h2>;
  }

  return (
    <div className="recipe-detail-container">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="recipe-header">
        <div className="recipe-emoji">{recipe.image}</div>
        <h1>{recipe.title}</h1>
      </div>

      <div className="recipe-detail-grid">

        <div className="recipe-box">
          <h2>Ingredientes</h2>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-box">
          <h2>Preparación</h2>
          <ol>
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

      </div>

    </div>
  );
};

export default RecipeDetail;