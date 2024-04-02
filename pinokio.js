const os = require('os')
const fs = require('fs')
const path = require("path")
const exists = (filepath) => {
  return new Promise(r=>fs.access(filepath, fs.constants.F_OK, e => r(!e)))
}
module.exports = {
  title: "ComfyUI-Launcher",
  description: "Stable Diffusion & Stable Video Diffusion GUI",
  icon: "icon.png",
  menu: async (kernel) => {
    let installed = await exists(path.resolve(__dirname, "ComfyUI-Launcher", "env"))
    if (installed) {
      let session = (await kernel.loader.load(path.resolve(__dirname, "session.json"))).resolved
      let gpu_running = kernel.running(__dirname, "start.json")
      let cpu_running = kernel.running(__dirname, "start_cpu.json")
      let running = cpu_running || gpu_running

      let arr

      if (gpu_running) {
        arr = [{
          icon: "fa-solid fa-spin fa-circle-notch",
          text: "Running"
        }, {
          icon: "fa-solid fa-desktop",
          text: "Server",
          href: "start.json",
          params: { fullscreen: true }
        }]
        if (session && session.url) {
          arr.push({
            icon: "fa-solid fa-rocket",
            text: "Open Web UI",
            href: session.url,
            target: "_blank"
          })
        }
      } else if (cpu_running) {
        arr = [{
          icon: "fa-solid fa-spin fa-circle-notch",
          text: "Running"
        }, {
          icon: "fa-solid fa-desktop",
          text: "Server",
          href: "start_cpu.json",
          params: { fullscreen: true }
        }]
        if (session && session.url) {
          arr.push({
            icon: "fa-solid fa-rocket",
            text: "Open Web UI",
            href: session.url,
            target: "_blank"
          })
        }
      } else {
        arr = [{
          icon: "fa-solid fa-power-off",
          text: "Launch",
          href: "start.json",
          params: { fullscreen: true, run: true }
        }, {
          icon: "fa-solid fa-power-off",
          text: "Launch CPU Mode (Slow)",
          href: "start_cpu.json",
          params: { fullscreen: true, run: true }
        }]
      }

      arr = arr.concat([{
        icon: "fa-solid fa-rotate",
        text: "Update",
        href: "update.json",
        params: { fullscreen: true, run: true }
      }, {
        text: "Download SDXL Turbo Model",
        icon: "fa-solid fa-download",
        href: "download-turbo.json",
        params: {
          run: true,
          fullscreen: true
        }
      }, {
        text: "Download Stable Video XT Model",
        icon: "fa-solid fa-download",
        href: "download-svd-xt.json",
        params: {
          run: true,
          fullscreen: true
        }
      }, {
        text: "Download Stable Video Model",
        icon: "fa-solid fa-download",
        href: "download-svd.json",
        params: {
          run: true,
          fullscreen: true
        }
      }, {
        text: "Download LCM LoRA",
        icon: "fa-solid fa-download",
        href: "download-lcm-lora.json",
        params: {
          run: true,
          fullscreen: true
        }
      }])
      return arr
    } else {
      if (kernel.platform === "darwin" && kernel.arch === "arm64") {
        return [{
          html: '<i class="fa-solid fa-plug"></i> Install with Stable Video Support (Takes around 20 minutes)',
          type: "link",
          href: "install_mac.json?run=true&fullscreen=true"
        }, {
          html: '<i class="fa-solid fa-plug"></i> Install without Stable Video (Quick)',
          type: "link",
          href: "install.json?run=true&fullscreen=true"
        }]
      } else {
        return [{
          html: '<i class="fa-solid fa-plug"></i> Install',
          type: "link",
          href: "install.json?run=true&fullscreen=true"
        }]
      }
    }
  }
}
