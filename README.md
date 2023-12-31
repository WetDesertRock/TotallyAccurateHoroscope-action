# TotallyAccurateHoroscope generator action

This action generates a prompt and writes the resulting horoscope into the specified directory. Purpose built for https://github.com/WetDesertRock/TotallyAccurateHoroscope/

## Inputs

### `template-file`

**Required** Path to the template file.

### `output-path`

Path to put the output file, note this action generates its own filename.

### `openai-api-key`

API key to used when communicating with ChatGPT. If not included this will generate a basic generated horoscope sutable for testing.

## Example usage

```yaml
uses: actions/TotallyAccurateHoroscope-action
with:
  template-file: 'archetypes/autogenerated.md'
  output-path: 'content/posts/horoscopes'
  openai-api-key: ${{ secrets.OPENAI_API_KEY }}
```
