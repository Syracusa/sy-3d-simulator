import * as THREE from 'three';
export default {

  uniforms: THREE.UniformsUtils.clone([
    THREE.UniformsLib.lights,
    THREE.UniformsLib.fog,
  ]),

  vertexShader: `
#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>

out vec4 vertexColor;
out vec3 vertexColor3;
void main()	{
        #include <begin_vertex>
        #include <beginnormal_vertex>     // Defines objectNormal
        #include <project_vertex>
        #include <worldpos_vertex>
        #include <defaultnormal_vertex>   // Defines transformedNormal
        #include <shadowmap_vertex>
        #include <fog_vertex>
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 sun = vec3(1.0, 2.0, 1.0);
    vec3 nsun = normalize(sun);

    float dProd = dot(vNormal, nsun);
    gl_Position =  projectionMatrix * modelViewMatrix *  vec4(position, 1.0 );

    if (dProd < 0.0){
        dProd = 0.0;
    }

    if (position.y > 16.0){
        vertexColor = vec4(dProd / 2.0,  (position.y / 20.0),  (position.y / 20.0), 1.0);
        vertexColor3 = vec3(dProd / 2.0,  (position.y / 20.0),  (position.y / 20.0));
    } else {
        vertexColor = vec4(dProd / 2.0,  (position.y / 20.0) * 0.5, (position.y / 20.0) * 0.1, 1.0);
        vertexColor3 = vec3(dProd / 2.0,  (position.y / 20.0) * 0.5, (position.y / 20.0) * 0.1);
    }

}
  `,
  fragmentShader:
    `
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <dithering_pars_fragment>

  in vec4 vertexColor;
  in vec3 vertexColor3;
  void main()	{
    vec3 shadowColor = vec3(0, 0, 0);
    float shadowPower = 0.5;
    //gl_FragColor = vertexColor;
    gl_FragColor = vec4( mix(vertexColor3, shadowColor, (1.0 - getShadowMask() ) * shadowPower), 1.0);
           #include <fog_fragment>
           #include <dithering_fragment>    
  }
`

  //   vertexShader: `
  //     #include <common>
  //     #include <fog_pars_vertex>
  //     #include <shadowmap_pars_vertex>
  //     void main() {
  //       #include <begin_vertex>
  //       #include <project_vertex>
  //       #include <worldpos_vertex>
  //       #include <shadowmap_vertex>
  //       #include <fog_vertex>
  //     }
  //   `,

  //   fragmentShader: `
  //     #include <common>
  //     #include <packing>
  //     #include <fog_pars_fragment>
  //     #include <bsdfs>
  //     #include <lights_pars_begin>
  //     #include <shadowmap_pars_fragment>
  //     #include <shadowmask_pars_fragment>
  //     #include <dithering_pars_fragment>
  //     void main() {
  //       // CHANGE THAT TO YOUR NEEDS
  //       // ------------------------------
  //       vec3 finalColor = vec3(0, 0.75, 0);
  //       vec3 shadowColor = vec3(0, 0, 0);
  //       float shadowPower = 0.5;
  //       // ------------------------------

  //       // it just mixes the shadow color with the frag color
  //       gl_FragColor = vec4( mix(finalColor, shadowColor, (1.0 - getShadowMask() ) * shadowPower), 1.0);
  //       #include <fog_fragment>
  //       #include <dithering_fragment>
  //     }
  //   `
};