import random
import time
import speech_recognition as sr
import json, requests

def recognize_speech_from_mic(recognizer, microphone):
   
    # verifique se os argumentos do reconhecedor e do microfone são do tipo apropriado
    if not isinstance(recognizer, sr.Recognizer):
        raise TypeError("`recognizer` deve ser uma instancia `Recognizer`")

    if not isinstance(microphone, sr.Microphone):
        raise TypeError("`microphone` deve ser uma instancia `Microphone`")

    # ajuste a sensibilidade do reconhecedor ao ruído ambiente e grave o áudio do microfone
    with microphone as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    # configurar o objeto de resposta
    response = {
        "success": True,
        "error": None,
        "transcription": None
    }

    # tente reconhecer o discurso na gravação
    # se uma exceção RequestError ou UnknownValueError for capturada,
    # atualize o objeto de resposta adequadamente
    try:
        response["transcription"] = recognizer.recognize_google(audio)
    except sr.RequestError:
        # API was unreachable or unresponsive
        response["success"] = False
        response["error"] = "API Indisponível"
    except sr.UnknownValueError:
        # discurso era ininteligível
        response["error"] = "Não foi possível reconhecer a fala"

    return response



# ------------------------------------------------------------------


def buscar_filme(filme) : 
    apikey = '1c88466d'
    uri = "http://www.omdbapi.com/?s=" + filme + "&apikey=" + apikey
    response = requests.get(uri)

    # print(response.status_code)
    # print(response.content)

    # Converte em um objeto Python
    busca = json.loads(response.content)['Search']

    for filme in busca:
        print("Filme: " + filme['Title'])
        print("Poster: " + filme['Poster'])
        print("-------------------------------------")


# --------------------------------------------------------------------

if __name__ == "__main__":
    # set the list of words, maxnumber of guesses, and prompt limit
    PROMPT_LIMIT = 5

    # create recognizer and mic instances
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    # get a random word from the list

    # format the instructions string
    instructions = "Quando aparecer 'Fale Agora!' diga o nome do filme.\n"

    # show instructions and wait 3 seconds before starting the game
    print(instructions)
    time.sleep(3)

    for j in range(PROMPT_LIMIT):
        print('Fale Agora!')
        voz = recognize_speech_from_mic(recognizer, microphone)
        if voz["transcription"]:
            break
        if not voz["success"]:
            break
        print("Eu não peguei isso. O que você disse?\n")

    # show the user the transcription
    print("You said: {}".format(voz["transcription"]))

    # determine if voz is correct and if any attempts remain
    filme = voz["transcription"]
    buscar_filme(filme)