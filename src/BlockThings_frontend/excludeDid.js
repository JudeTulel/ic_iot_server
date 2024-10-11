export default function excludeDid() {
    return {
      name: 'exclude-did',
      resolveId(source) {
        if (source.endsWith('.did')) {
          return {
            id: source,
            external: true
          };
        }
        return null;
      }
    };
  }