package com.nutrichef.util;

import java.util.Set;

/**
 * Única fuente de verdad para unidades válidas del sistema.
 * El frontend debe reflejar exactamente este mismo listado.
 */
public final class AllowedUnits {

    private AllowedUnits() {}

    public static final Set<String> ALLOWED = Set.of(
            "unidad",
            "unidades",
            "taza",
            "tazas",
            "cda",      // cucharada
            "cdta",     // cucharadita
            "pieza",
            "piezas",
            "porcion",
            "porciones",
            "rebanada",
            "rebanadas",
            "manojo",
            "diente",
            "dientes"
    );

    /** Normaliza: minúsculas + trim. */
    public static String normalize(String unit) {
        if (unit == null) return "";
        return unit.trim().toLowerCase();
    }

    public static boolean isAllowed(String unit) {
        return ALLOWED.contains(normalize(unit));
    }
}
