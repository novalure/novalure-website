import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const patches = [
  {
    file: path.join(root, "scripts", "generate-playbooks.mjs"),
    replacements: [
      [
        "No fit: no concrete project, no sales function or no willingness to operate the system.",
        "No fit: no concrete project, no sales ownership or no willingness to support structured follow-up and handover."
      ]
    ]
  },
  {
    file: path.join(root, "public", "playbooks", "developer-pipeline-playbook-en.html"),
    replacements: [
      [
        "No fit: no concrete project, no sales function or no willingness to operate the system.",
        "No fit: no concrete project, no sales ownership or no willingness to support structured follow-up and handover."
      ]
    ]
  },
  {
    file: path.join(root, "content", "relaunch-copy.ts"),
    replacements: [
      ["\"login\": \"CRM-Login\"", "\"login\": \"Systembeispiel ansehen\""],
      ["\"login\": \"CRM login\"", "\"login\": \"View system example\""],
      ["\"login\": \"Acceso al CRM\"", "\"login\": \"Ver ejemplo del sistema\""],
      [
        "\"demoNote\": \"Beispielansicht – keine echten Kundendaten\"",
        "\"demoNote\": \"Von NovaLure betriebene Beispielansicht – keine echten Kundendaten. Ihr Team erhält qualifizierte Übergaben, dokumentierte nächste Schritte und vereinbarte Auswertungen.\""
      ],
      [
        "\"demoNote\": \"Demo view — no real customer data\"",
        "\"demoNote\": \"Example view operated by NovaLure — no real client data. Your team receives qualified handovers, documented next steps and agreed reporting.\""
      ],
      [
        "\"demoNote\": \"Demostración: sin datos reales de clientes\"",
        "\"demoNote\": \"Vista de ejemplo operada por NovaLure; no contiene datos reales de clientes. Su equipo recibe traspasos cualificados, próximos pasos documentados e informes acordados.\""
      ],
      [
        "\"sysB3\": \"Übergabe mit Kontext: Score, Quelle und nächster Schritt sind dokumentiert.\"",
        "\"sysB3\": \"NovaLure führt den Prozess operativ im System. Ihr Team erhält qualifizierte Übergaben, klare nächste Schritte und vereinbarte Auswertungen – ohne das CRM selbst administrieren zu müssen.\""
      ],
      [
        "\"sysB3\": \"Handover with context: score, source and next step are documented.\"",
        "\"sysB3\": \"NovaLure operates the process in the system on your behalf. Your team receives qualified handovers, clear next steps and agreed reporting without having to administer the CRM.\""
      ],
      [
        "\"sysB3\": \"El traspaso conserva el contexto: puntuación, origen y siguiente paso quedan documentados.\"",
        "\"sysB3\": \"NovaLure opera el proceso dentro del sistema por cuenta del cliente. Su equipo recibe traspasos cualificados, próximos pasos claros e informes acordados sin tener que administrar el CRM.\""
      ],
      [
        "\"c2\": \"Lead-Pfad mit Qualifizierung, Follow-up-Struktur und Übergabe ins CRM.\"",
        "\"c2\": \"Lead-Pfad mit Qualifizierung, Follow-up und dokumentierter Übergabe an den Vertrieb. Eine Übertragung in ein bestehendes Kunden-CRM wird je Mandat technisch und vertraglich vereinbart.\""
      ],
      [
        "\"c2\": \"A lead path with qualification, follow-up structure and CRM handover.\"",
        "\"c2\": \"A lead path with qualification, follow-up and documented handover to sales. Any transfer into an existing client CRM is agreed technically and contractually for the individual mandate.\""
      ],
      [
        "\"c2\": \"Un recorrido con cualificación, seguimiento estructurado y traspaso al CRM.\"",
        "\"c2\": \"Recorrido con cualificación, seguimiento y traspaso documentado al equipo comercial. La transferencia a un CRM ya existente del cliente se acuerda técnica y contractualmente para cada encargo.\""
      ]
    ]
  },
  {
    file: path.join(root, "content", "spanish-market-positioning.ts"),
    replacements: [
      [
        "c2: \"Recorrido de captación con cualificación, seguimiento y traspaso comercial al CRM.\"",
        "c2: \"Recorrido con cualificación, seguimiento y traspaso documentado al equipo comercial. La transferencia a un CRM ya existente del cliente se acuerda técnica y contractualmente para cada encargo.\""
      ]
    ]
  }
];

for (const patch of patches) {
  let source = fs.readFileSync(patch.file, "utf8");
  let changed = false;

  for (const [previous, replacement] of patch.replacements) {
    if (source.includes(replacement)) continue;
    if (!source.includes(previous)) {
      throw new Error(`Expected wording not found in ${path.relative(root, patch.file)}: ${previous}`);
    }
    source = source.replaceAll(previous, replacement);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(patch.file, source, "utf8");
    console.log(`Updated ${path.relative(root, patch.file)}`);
  } else {
    console.log(`Managed-service wording already present in ${path.relative(root, patch.file)}`);
  }
}
