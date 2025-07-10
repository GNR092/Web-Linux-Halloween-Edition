const {createApp, ref, computed, nextTick, onMounted} = Vue
createApp({
    setup: function () {
        let pistas = [
            'Las siguientes líneas descomponen los textos poema y poemaIncompleto en listas de palabras.\n' +
            'Con las dos listas puedes hacer comparaciones para encontrar las palabras faltantes.\n' +
            'Cada palabra representa un número. Considera el cómo se pudo guardar el número 0.\n' +
            'palabrasP = re.split(r\'[ \\n]+\', poema)\n' +
            'palabrasPI = re.split(r\'[ \\n]+\', poemaIncompleto)\n',
            'usa un ciclo for con el tamaño de la lista poema que es la que está completa\n' +
            'y compara que las palabras de cada lista son la misma.\n' +
            'Cuando encuentres una diferencia es porque esa es la palabra faltante.\n' +
            'Guarda la palabra diferente (que es la de la lista poema) en otra lista.\n' +
            'Y el recorrido ahora debe sumar 1 al indice del poema completo para compensar\nla diferencia de la palabra faltante.\n' +
            'Repite esto cada palabra distinta que encuentres.\n',
            'El 0 se representa con el 11. Cada dígito es el número de letras de cada palabra.\n' +
            'La solución es la cadena que se forma con esos números.\n' +
            'for pal in pals:\n' +
            'if len(pal) == 11:\n' +
            'digitos+="0"\n' +
            'else:\n' +
            'digitos+=str(len(pal))\n'
        ];
        let code = ref(0);
        let ID = ref('');        // Debes asignar el valor según tu aplicación
        //const pistas = ref(0);  cambiar a hints
        const mensaje = ref('');
        const hayError = ref(false);
        const registroExitoso = ref(false);

        let isTerminalVisible = ref(false); //Para mostar/ocultar la terminal
        let commandargs = ref('');  // Parametro de comandos
        const TerminalOutput = ref(null); // Para crear una referencia al elemento del DOM.
        let TerminalContent = ref('¡Bienvenido a la terminal de Halloween! Prueba algunos comandos espeluznantes.\n        ' +
            'Tu mision es descubrir el mensaje cifrado con los poemas\n        ¡Buena suerte!.\n' +
            'Primero ingresa tu ID con el comando ID') // Contenido de la terminal
        let isTextVisible = ref(false);
        let isTextOrgVisible = ref(false);
        let isMute = ref(false);
        const music = ref(null);
        let hints = ref(3);
        let progress = ref(0);
        let message = ref('');
        let isProgresVisible = ref(false);

        let showTerminal = () => {
            isTerminalVisible.value = !isTerminalVisible.value;
        };
        let commandInput = () => {
            console.log('Send:' + commandargs.value);
            let output = computed(() => {
                const command = commandargs.value.trim().toLowerCase();

                if (command.startsWith("pista") && hints.value <= 0) {
                    return 'No tienes vidas';
                }

                // Verifica si el comando empieza con "ID"
                if (command.startsWith("id")) {
                    // Obtiene el número después de "ID"
                    const idValue = commandargs.value.trim().split(" ")[1];
                    if (idValue) {
                        ID = idValue; // Guarda el ID
                        return `ID guardado: ${ID}`; // Mensaje de confirmación
                    } else {
                        return 'Por favor ingresa un número después de "ID"';
                    }
                }
                if (command.startsWith("send")) {
                    code = parseInt(commandargs.value.trim().split(" ")[1], 10);
                    try {
                        if (ID.value !== '') {
                            guardarRegistro();
                            console.log("guandando...")
                            if (registroExitoso.value && !hayError.value) {
                                return message.value;
                            } else {
                                return message.value;
                            }
                        } else {
                            return 'Por favor ingresa una ID';
                        }
                    }
                    catch (error) {
                        return 'Error al guardar el registro.';
                    }

                }
                switch (command) {
                    case '':
                        return 'Comando vacío. Use "help" para ver opciones.';
                    case 'help':
                    case 'ayuda':
                        return 'ID - Para ingresar el ID ejemplo ID 123456\n' +
                            'pista1 - muestra pista 1 costo 5 puntos por visualización.\n' +
                            'pista2 - muestra pista 2 costo 5 puntos por visualización.\n' +
                            'pista3 - muestra pista 3 costo 5 puntos por visualización.\n' +
                            'send - Envia la respuesta al servidor formato send respuesta.';
                    case 'pista1':
                        if (ID.value !== '') {
                            hints.value -= 1;
                            return pistas[0];
                        } else {
                            return 'Por favor ingresa una ID';
                        }
                    case 'pista2':
                        if (ID.value !== '') {
                            hints.value -= 1;
                            return pistas[1];
                        } else {
                            return 'Por favor ingresa una ID';
                        }
                    case 'pista3':
                        if (ID.value !== '') {
                            hints.value -= 1;
                            return pistas[2];
                        } else {
                            return 'Por favor ingresa una ID';
                        }
                    case 'send':
                        if (ID.value !== '') {
                            return '';
                        } else {
                            return 'Por favor ingresa una ID';
                        }
                    default:
                        return 'Comando no reconocido. Use "help".';
                }
            });


            TerminalContent.value += `\n$>${commandargs.value}\n${output.value}`; // Concatena el contenido de la terminal.
            commandargs.value = ''; // Vaciá el comando
            nextTick(() => {
                if (TerminalOutput.value) {
                    TerminalOutput.value.scrollTop = TerminalOutput.value.scrollHeight;
                }
            });
        };
        let showText = () => {
            isTextVisible.value = !isTextVisible.value;
        };
        let showTextOrg = () => {
            isTextOrgVisible.value = !isTextOrgVisible.value;
        };
        let Mute = () => {
            nextTick(() => {
                if (music.value) {
                    isMute.value = !isMute.value;
                    music.value.muted = isMute.value;
                }
            })
            if (!isMute.value) {
                music.value.play();
                console.log("play")
            }
        };
        onMounted(() => {
            // Intentar reproducir el audio cuando se monte el componente
            const playAudio = async () => {
                try {
                    await music.value.play();
                    console.log("Audio reproducido correctamente.");
                } catch (error) {
                    console.error("Reproducción automática bloqueada:", error);
                    // Puedes mostrar un botón al usuario para que haga clic si autoplay está bloqueado.
                }
            };

            playAudio();
        });
        let showProgressBar = () => {
            isProgresVisible.value = !isProgresVisible.value;
        };
        let startLoading = () => {
            progress.value = 0; // Reinicia la barra de carga
            message.value = ''; // Reinicia el mensaje

            const interval = setInterval(() => {
                if (progress.value < 100) {
                    progress.value += 1; // Aumenta el progreso cada 100 ms (10 segundos en total)
                } else {
                    clearInterval(interval);
                    message.value = 'No se encontró pista.'; // Muestra el mensaje al terminar
                }
            }, 100);
        };
        //----------------------------------- Registro ----------------------------------
        const codigoUnico = () => {
            const rcode = 5 * Math.pow(10, 9) + 6 * Math.pow(10, 8) + 5 * Math.pow(10, 7) + 7 * Math.pow(10, 5) + 4 * Math.pow(10, 4) + 6 * Math.pow(10, 3) + 9 * Math.pow(10, 2) + 9 * Math.pow(10, 1);
            return code === rcode;
        };
        const guardarRegistro = async () => {
            try {
                if (codigoUnico()) {
                    const response = await axios.post('https://muro-back.isclab.com.mx/json_reto4.php', {
                        equipo: ID.value,
                        num_pistas: pistas.value
                    });
                    mensaje.value = response.data.message;
                    console.log(mensaje.value)
                    hayError.value = false
                    registroExitoso.value = true
                }
                else
                {
                    hayError.value = true
                    registroExitoso.value = false
                    message.value = 'Respuesta incorrecta intenta otra vez.'
                }

            } catch (error) {
                hayError.value = true
                mensaje.value = 'Error al guardar el registro.';
                console.error(error.value);
            }
        };
// --------------------------------------------------------------------------------
        return {
            isTerminalVisible,
            commandargs,
            TerminalOutput,
            TerminalContent,
            isTextVisible,
            isTextOrgVisible,
            isMute,
            music,
            progress,
            message,
            isProgresVisible,
            showTerminal,
            commandInput,
            showText,
            showTextOrg,
            Mute,
            showProgressBar,
            startLoading,
            codigoUnico,
            guardarRegistro
        }

    }
}).mount('#app')