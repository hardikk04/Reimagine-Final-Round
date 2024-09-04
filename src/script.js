// Importing the libraries
import * as THREE from "three";
import "remixicon/fonts/remixicon.css";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import vertexShader from "./shaders/Imghover/vertex.glsl";
import fragmentShader from "./shaders/Imghover/fragment.glsl";
// import Swiper from "swiper/bundle";
// import "swiper/css/bundle";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Page 2 Animation
const page3Animation = () => {
  class Sketch {
    constructor(options) {
      this.time = 0;
      this.scene = new THREE.Scene();
      this.container = options.dom;
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;

      this.camera = new THREE.PerspectiveCamera(
        70,
        this.width / this.height,
        100,
        2000
      );
      this.camera.position.z = 600;
      this.camera.fov = 2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI);
      this.scene.add(this.camera);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      this.container.appendChild(this.renderer.domElement);

      this.clock = new THREE.Clock();
      this.materials = [];
      this.meshes = [];
      this.changeImg = null;

      this.lenis = new Lenis();
      this.lenis.stop();

      this.addImages();
      this.render();
      this.resize();
      this.setupResize();
      this.setPosition();
    }

    setPosition() {
      this.imageStore.forEach((o) => {
        o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
        o.mesh.position.y =
          -o.top + this.height / 2 - o.height / 2 + this.lenis.animatedScroll;
      });
    }

    setupResize() {
      window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
      this.height = this.container.offsetHeight;
      this.width = this.container.offsetWidth;
      this.camera.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      this.camera.updateProjectionMatrix();

      this.camera.fov = 2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI);

      this.imageStore.forEach((i) => {
        const bounds = i.img.getBoundingClientRect();
        i.mesh.scale.set(bounds.width, bounds.height, 1);
        i.top = bounds.top + this.lenis.animatedScroll;
        i.left = bounds.left;
        i.width = bounds.width;
        i.height = bounds.height;
      });
    }

    addImages() {
      const images = [...document.querySelectorAll(".webgl")];

      this.geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture1: new THREE.Uniform(0),
          uTexture2: new THREE.Uniform(0),
          time: new THREE.Uniform(0),
          hoverState: new THREE.Uniform(0),
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // wireframe: true,
      });

      this.materials = [];

      this.changedTextures = ["imgs/pg3_2.jpeg", "imgs/pg3_1.jpeg"];
      const textureLoader = new THREE.TextureLoader();

      const loadedChangedTextures = this.changedTextures.map((texture) => {
        const t = textureLoader.load(texture);
        return t;
      });

      this.imageStore = images.map((img, index) => {
        const bonds = img.getBoundingClientRect();

        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;

        const material = this.material.clone();
        material.uniforms.uTexture1.value = texture;

        this.materials.push(material);

        const mesh = new THREE.Mesh(this.geometry, material);
        mesh.scale.set(bonds.width, bonds.height, 1);
        this.scene.add(mesh);

        img.addEventListener("mouseenter", () => {
          material.uniforms.uTexture2.value = loadedChangedTextures[index];
          gsap.to(material.uniforms.hoverState, {
            value: 1,
          });
        });

        img.addEventListener("mouseleave", () => {
          gsap.to(material.uniforms.hoverState, {
            value: 0,
          });
        });

        return {
          img: img,
          mesh: mesh,
          width: bonds.width,
          height: bonds.height,
          top: bonds.top + this.lenis.animatedScroll,
          left: bonds.left,
        };
      });
    }
    render(time) {
      this.time = this.clock.getElapsedTime();

      this.materials.forEach((m) => {
        m.uniforms.time.value = this.time;
      });

      if (this.lenis) {
        this.lenis.start();
        this.lenis.raf(time);
        this.setPosition();
      }

      this.renderer.render(this.scene, this.camera);

      window.requestAnimationFrame(this.render.bind(this));
    }
  }

  new Sketch({ dom: document.querySelector(".container-canvas") });
};

page3Animation();

// Page 6 Animation
const page6Animation = () => {
  const page6Products = document.querySelector(".page6-products");

  page6Products.addEventListener("mousemove", (event) => {
    document.body.style.cursor = "none";
    gsap.to(".page6-product-cursor", {
      left: event.clientX - 350,
      top: event.clientY - 350,
      scale: 1,
    });
  });

  page6Products.addEventListener("mouseleave", (event) => {
    document.body.style.cursor = "initial";
    gsap.to(".page6-product-cursor", {
      scale: 0,
    });
  });

  let productFlag = "product1";

  const product1 = () => {
    const tl = gsap.timeline();
    tl.to(
      ".page6-contianer",
      {
        backgroundImage: "linear-gradient(to bottom right, #FB0408, #ba0407)", // set background color,
      },
      "a"
    )
      .to(
        ".page6-product-img1",
        {
          top: "-150%",
          opacity: 0,
          onComplete: () => {
            gsap.to(".page6-product-img1", {
              top: "100%",
            });
          },
        },
        "a"
      )
      .to(".page6-product-img2", {
        top: "-50%",
        opacity: 1,
      });
    productFlag = "product2";
  };

  const product2 = () => {
    const tl = gsap.timeline();
    tl.to(
      ".page6-contianer",
      {
        backgroundImage: "linear-gradient(to bottom right, #3c4ef3, #182ef3)", // set background color,
      },
      "a"
    )
      .to(
        ".page6-product-img2",
        {
          top: "-150%",
          opacity: 0,
          onComplete: () => {
            gsap.to(".page6-product-img2", {
              top: "100%",
            });
          },
        },
        "a"
      )
      .to(".page6-product-img1", {
        top: "-50%",
        opacity: 1,
      });
    productFlag = "product1";
  };

  page6Products.addEventListener("click", (event) => {
    if (productFlag === "product1") {
      product1();
      const tl = gsap.timeline();
      tl.to(".page6-product-cursor>h3", {
        text: "",
      });
      tl.to(".page6-product-cursor>h3", {
        text: "NEXT",
      });
    } else if (productFlag === "product2") {
      product2();
      const tl = gsap.timeline();
      tl.to(".page6-product-cursor>h3", {
        text: "",
      });
      tl.to(".page6-product-cursor>h3", {
        text: "NEXT",
      });
    }
  });
};

page6Animation();
