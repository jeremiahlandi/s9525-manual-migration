content = """# Workshop Manual Migration Tool (s9525-manual-migration)

This repository contains the extraction and transformation logic used to migrate a legacy HTML workshop manual into a structured data format suitable for modern CMS integration (Sanity.io).

## 🚀 Overview
The manual consists of thousands of legacy HTML files with inconsistent styling but highly consistent data attributes. This tool performs a **Recursive Walk** through the source directories to identify, extract, and clean technical data.

## 📂 Data Mapping & Dictionary
This project acts as the "Source of Truth" for translating legacy HTML tags into modern JSON objects.

### Core Data Mapping
| Legacy HTML Element | Purpose | Targeted Attribute/Tag | JSON Schema Field |
| :--- | :--- | :--- | :--- |
| **Title** | Procedure Name | `h1 > center` | `title` (String) |
| **Special Tool** | Required equipment | `[toolkit="toolkit"]` | `tools` (Array of Objects) |
| **Material** | Consumables | `[materialtype]` | `materials` (Array of Strings) |
| **Repair Steps** | Sequential instructions| `ol > li` | `steps` (Array of Strings) |
| **Graphics** | Illustrations | `img[src]` | `imageReferences` (Array) |

### Extraction Logic Examples

- **Special Tools:** Targets the `toolkit` attribute and extracts the unique ID from the `id` property (e.g., `toolkit-303-1245` becomes `303-1245`).
- **Sequential Steps:** Collects all `li` children within primary `ol` tags, stripping legacy entities like `&nbsp;`.
- **Consumables:** Uses the `materialtype` attribute to isolate specific chemicals and fluids required for the task.

## 🛠 Tech Stack
- **Node.js:** The runtime environment for the migration script.
- **Cheerio:** Used for server-side HTML parsing and jQuery-like DOM manipulation.
- **fs-extra:** Enhanced file system modules for recursive directory walking.

## 💻 Usage
To run the extraction process:
1. Ensure the source manual is located at `../s9525`.
2. Install dependencies:
   ```bash
   npm install