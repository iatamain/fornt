/*
Procedural library for rendering with ray marching
*/
const RM_SHADER_PATH = "shaders/"
const RM_CAMERA_DIR = new Float32Array([0,0,1])
const RM_CAMERA_POS = new Float32Array([0,5,0])
const RM_SCREEN_COORDS = new Float32Array([
  -1,-1,
  1,-1,
  -1,1,
  1,1
])

const RM_SHADER_PROGRAMS = {
  "main": undefined,
}

var rm_debugMode = 0
var rm_gl = undefined

//support functions
function rm_loadTextResources(url){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest()

        request.open('GET', url, true)
        request.onload = function(){
            if (request.status >=200 && request.status < 300){
              resolve(request.responseText)
            }else{
              reject("Error: HTTP-status - " + request.status + " on resource " + url)
            }
        }
        request.responseType = 'text'
        request.send()
    })
}

function rm_compileShader(vertexShaderSource,fragmentShaderSource){
  function createShader( type, source){
		let shader = rm_gl.createShader(type)
		rm_gl.shaderSource(shader, source)
		rm_gl.compileShader(shader)
		let success = rm_gl.getShaderParameter(shader, rm_gl.COMPILE_STATUS)
		if(success){
			return shader
		}
		console.log(rm_gl.getShaderInfoLog(shader))
    console.log(source)
		rm_gl.deleteShader(shader)
	}

	function createProgram( vertexShader, fragmentShader){
		let program = rm_gl.createProgram()
		rm_gl.attachShader(program, vertexShader)
		rm_gl.attachShader(program, fragmentShader)
		rm_gl.linkProgram(program)
		let success = rm_gl.getProgramParameter(program, rm_gl.LINK_STATUS)
		if(success){
			return program
		}
		console.log(rm_gl.getProgramInfo)

	}

	let vertexShader = createShader( rm_gl.VERTEX_SHADER, vertexShaderSource)
	let fragmentShader = createShader( rm_gl.FRAGMENT_SHADER, fragmentShaderSource)

  if(vertexShader==undefined || fragmentShader==undefined){
    console.log(vertexShaderSource)
    console.log(fragmentShaderSource)
  }
	let program = createProgram( vertexShader, fragmentShader)
  if(program==undefined){
    console.log(vertexShaderSource)
    console.log(fragmentShaderSource)
  }
	return program
}

function rm_getShaderTo(name,shaderClass = undefined){
    if(!shaderClass)shaderClass = name
    let urlVert = RM_SHADER_PATH + name+".vert"
    let urlFrag = RM_SHADER_PATH + name+".frag"

    let vertexShaderSource = undefined
    let fragmentShaderSource = undefined

    return rm_loadTextResources(urlVert)
    .then((result)=>{
        vertexShaderSource = result
        return rm_loadTextResources(urlFrag)
    })
    .then((result)=>{
        fragmentShaderSource = result
        console.log("Resources shader(",name,") downloaded. Compiling...")
        RM_SHADER_PROGRAMS[shaderClass] = rm_compileShader(vertexShaderSource,fragmentShaderSource)
        console.log("Resources shader(",name,") compiled successfull.")
        return true
    })
    .catch(function(error){
      console.log("Error on downloading resources shader(",name,"):"+error)
    })
}

function rm_getAllShader(){
  let promise = new Promise((resolve, reject)=>{resolve()})
  for(let key in RM_SHADER_PROGRAMS){
      promise = promise.then((result)=>{
        return rm_getShaderTo(key)
      })
  }
  return promise
}



function rm_initialWebGL(canvas, then_function){
  rm_gl = canvas.getContext('webgl2')
  if(!rm_gl) alert("WebGL2 is Not Found! Your browser is to old.\nOr this Internet Explorer browser.\nOr this Safari browser")
  console.log(rm_gl.canvas.width, rm_gl.canvas.height)
  rm_gl.viewport(0, 0, rm_gl.canvas.width, rm_gl.canvas.height)
	rm_gl.clearColor(0, 0, 0, 1)
	//rm_gl.enable(rm_gl.DEPTH_TEST)

  rm_getAllShader().then(then_function)
}

function rm_render(){
    rm_gl.clear(rm_gl.COLOR_BUFFER_BIT)

    let shader_programm = RM_SHADER_PROGRAMS["main"]

    //const u_camera_matrix_loc = gl.getUniformLocation(shader_programm,"u_cameraMatrix")
    const u_cameraDirection_loc = rm_gl.getUniformLocation( shader_programm, "u_cameraDirection")
    const u_cameraPosition_loc = rm_gl.getUniformLocation( shader_programm, "u_cameraPosition")
    const u_debugMode_loc = rm_gl.getUniformLocation( shader_programm, "u_debugMode")

    const a_position_loc = rm_gl.getAttribLocation( shader_programm, "a_position")
    const positionsBuffer = rm_gl.createBuffer()


    rm_gl.useProgram(shader_programm)
    rm_gl.bindBuffer(rm_gl.ARRAY_BUFFER, positionsBuffer)
    rm_gl.bufferData(rm_gl.ARRAY_BUFFER, RM_SCREEN_COORDS, rm_gl.STREAM_DRAW)

    rm_gl.enableVertexAttribArray(a_position_loc)
    rm_gl.vertexAttribPointer(
      a_position_loc, 2,
      rm_gl.FLOAT, false, 0, 0
    )

    //gl.uniformMatrix4fv(u_camera_matrix_loc, false, CAMERA_MATRIX.getLow())
    rm_gl.uniform3fv(u_cameraDirection_loc, RM_CAMERA_DIR)
    rm_gl.uniform3fv(u_cameraPosition_loc, RM_CAMERA_POS)
    rm_gl.uniform1ui(u_debugMode_loc, rm_debugMode)

    rm_gl.drawArrays(rm_gl.TRIANGLE_STRIP, 0, 4)
    rm_gl.deleteBuffer(positionsBuffer)
}
