import fs from "fs/promises";
import path from "path";

export class FileManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async ensureFile() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, "[]");
    }
  }

  async read() {
    await this.ensureFile();
    const content = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(content);
  }

  async write(data) {
    await this.ensureFile();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }
}
