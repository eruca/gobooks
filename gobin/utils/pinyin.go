package utils

import (
	"strings"

	"github.com/mozillazg/go-pinyin"
)

// FirstLetters will parse and return the first letter of sentences
// sentence will separate by comma
func FirstLetters(sentences ...string) string {
	arg := pinyin.NewArgs()
	arg.Style = pinyin.FirstLetter

	var results []string
	for _, sentence := range sentences {
		var result []string
		for _, word := range sentence {
			switch {
			case word >= 'a' && word <= 'z':
				result = append(result, string(word))
			case word >= 'A' && word <= 'Z':
				result = append(result, string(word-'A'+'a'))
			case word >= '0' && word <= '9':
				result = append(result, string(rune(word)))
			default:
				letters := pinyin.Pinyin(string(word), arg)
				for _, letters := range letters {
					result = append(result, letters[0])
				}
			}
		}
		results = append(results, strings.Join(result, ""))
	}

	return strings.Join(results, ",")
}
