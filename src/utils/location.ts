import { quitarTildesYNumeros } from "./normalizeText";
import { reemplazarVariosTextos } from "./textReplacer";

type AddressResult = {
    address: string;
    district: string;
    address_components?: { long_name: string; short_name: string; types: string[] }[];
};
type District = {
    id: number;
    idPadre: number | null;
    cantidad: number;
    nombre: string;
    nombre2: string;
};
type Department = {
    id: number;
    idPadre: number | null;
    cantidad: number;
    nombre: string;
    nombre2: string;
};

type LocationData = {
    idUbigeo: string;
    department: { value: number; label: string; quantity: number };
    district: { label: string; quantity: number; value: number };
    latitude: number;
    longitude: number;
    address: string;
    districtbydepartment?: District[];
};

  
export const getDistrictsByAddress = (
        results: AddressResult[],
        districtsAll:District[],
        departments:Department[],
        latitude: number,
        longitude: number,
        addressToFind: string,
        callback: (data: LocationData) => void
    ): void => {
        
    const addressComponents = results[0].address_components ?? [];
    let newAddress: string[] = [];

    addressComponents.forEach((component) => {
        if (component.long_name) {
          const textoModificado = reemplazarVariosTextos(
            quitarTildesYNumeros(component.long_name.toLowerCase().trim()),
            { "cuzco": "cusco" }
          );
          newAddress.push(textoModificado);
        }
    });

    const addressModified = newAddress.map((elemento) => {
        return reemplazarVariosTextos(elemento, {
          "santiago": "santia",
          "corca":"ccorca",
        });
    });

    newAddress = addressModified;
    const auxDistrict: District[] = [];

    districtsAll?.forEach((c: District) => {
    const nombre = quitarTildesYNumeros(c.nombre.toLowerCase().trim());
    for (let i = 0; i < newAddress.length; i++) {
        if (quitarTildesYNumeros(newAddress[i].toLowerCase().trim()) === nombre) {
        auxDistrict.push(c);
        break;
        }
    }
    });

    const mapaPosiciones = new Map<string, number>();
        for (let i = 0; i < newAddress.length; i++) {
            const parteAddress = newAddress[i];
            mapaPosiciones.set(parteAddress.toLowerCase(), i);
        }

        auxDistrict.sort((a, b) => {
        const posicionA = mapaPosiciones.get(a.nombre.toLowerCase());
        const posicionB = mapaPosiciones.get(b.nombre.toLowerCase());

        if (posicionA === undefined) return 1;
        if (posicionB === undefined) return -1;

        return posicionA - posicionB;
    });

    const nuevoDistrito: District[] = [];

    for (const distrito of auxDistrict) {
        nuevoDistrito.push(distrito);
    }

    let addressMatches: District[] = [];

    for (const nuevoDistrito_ of nuevoDistrito) {
        for (let i = 0; i < newAddress.length; i++) {
          if (newAddress[i].toLowerCase().trim() === nuevoDistrito_.nombre.toLowerCase().trim()) {
            for (const x in departments) {
              if (nuevoDistrito_.idPadre?.toString() === departments[x].id.toString()) {
                addressMatches.push(nuevoDistrito_);
              }
            }
            newAddress.splice(i, 1);
            break;
          }
      
          const nuevonombre = newAddress[i].split(" ");
          for (const n_ of nuevonombre) {
            if (n_.toLowerCase().trim() === nuevoDistrito_.nombre.toLowerCase().trim()) {
              for (const x in departments) {
                if (nuevoDistrito_.idPadre?.toString() === departments[x].id.toString()) {
                  addressMatches.push(nuevoDistrito_);
                }
              }
              newAddress.splice(i, 1);
              break;
            }
          }
        }
    }

    const datas: District[] = [];

    if (addressMatches.length > 2) {
        const contadorIdPadre: Record<string, number> = {};
        for (const dato of addressMatches) {
          const idPadre = dato.idPadre;
          if (idPadre !== undefined) {
            contadorIdPadre[idPadre ?? ''] = (contadorIdPadre[idPadre ?? ''] || 0) + 1;
          }
        }
      
        const nuevoArray = addressMatches.filter((dato) => {
          const idPadre = dato.idPadre;
          return idPadre !== undefined && contadorIdPadre[idPadre ?? ''] > 1;
        });
      
        if (nuevoArray.length > 0) {
          addressMatches = nuevoArray;
        } else {
          for (const dep of departments) {
            for (let i = 0; i < addressMatches.length; i++) {
              if (i === addressMatches.length - 1) {
                if (dep.id.toString() === addressMatches[i].idPadre?.toString()) {
                  datas.push(addressMatches[i]);
                }
              }
            }
          }
          addressMatches = datas;
        }
    } else {
        function tienenMismoID(objetoA: District | undefined, objetoB: District | undefined): boolean {
          if (objetoA !== undefined && objetoB !== undefined) {
            return objetoA.idPadre === objetoB.idPadre;
          }
          return false;
        }
      
        if (addressMatches.length > 1 && tienenMismoID(addressMatches[0], addressMatches[1])) {
          datas.push(addressMatches[0]);
        } else {
          for (const dep of departments) {
            for (let i = 0; i < addressMatches.length; i++) {
              if (i === addressMatches.length - 1) {
                if (dep.id.toString() === addressMatches[i].idPadre?.toString()) {
                  datas.push(addressMatches[i]);
                }
              }
            }
          }
        }
        addressMatches = datas;
      }

      if (addressMatches.length === 0) {
        districtsAll.forEach((c) => {
          const nombre = quitarTildesYNumeros(c.nombre.toLowerCase().trim());
          const nameAddressToFind = addressToFind.split(" ");
          let auxAddress: string | null = null;
          
          if (auxAddress === null) {
            nameAddressToFind.forEach((component) => {
              const textoModificado = reemplazarVariosTextos(
                quitarTildesYNumeros(component.toLowerCase().trim()), 
                {
                  "cuzco": "cusco",
                }
              );
              if (textoModificado === nombre) {
                addressMatches.push(c);
                auxAddress = 'address';
                return;
              } else {
                auxAddress = "addressComponent";
                return;
              }
            });
          } else if (auxAddress === "addressComponent") {
            addressComponents.forEach((component) => {
              const textoModificado = reemplazarVariosTextos(
                quitarTildesYNumeros(component.long_name.toLowerCase().trim()),
                {
                  "cuzco": "cusco",
                }
              );
              if (textoModificado === nombre) {
                addressMatches.push(c);
                auxAddress = null;
                return;
              }
            });
          }
      
          const componentArreglo = nombre.split("-");
          if (componentArreglo.length === 2 && componentArreglo.includes(nombre)) {
            addressMatches.push(c);
          }
        });
    }

    let distritoOriginal: { label: string; quantity: number; value: number } | null = null;
    const departamento: Department[] = [];
    const districtbydepartment: District[] = [];

        if (addressMatches[0] != null) {
            let ultimoAddressMatch: District | null = null;
            if (addressMatches.length > 3) {
                const contadorIdPadre: Record<string, number> = {};
                for (const dato of addressMatches) {
                  const idPadre = dato.idPadre;
                  if (idPadre !== undefined) {
                    contadorIdPadre[idPadre ?? ''] = (contadorIdPadre[idPadre ?? ''] || 0) + 1;
                  }
                }
                const nuevoArray = addressMatches.filter((dato) => {
                    const idPadre = dato.idPadre;
                    return idPadre !== undefined && contadorIdPadre[idPadre ?? ''] > 1;
                  });
                addressMatches = nuevoArray;
            }

            for (const addressMa of addressMatches) {
                for (const departamento of departments) {
                if (departamento.id.toString() === '1392') {
                    if (addressMa.idPadre?.toString() === departamento.id.toString()) {
                    ultimoAddressMatch = addressMatches[addressMatches.length - 1];
                    } else {
                    ultimoAddressMatch = addressMatches[0];
                    }
                }
                }
            }
            
            if (addressMatches.length > 0 && ultimoAddressMatch !== null) {
                
                distritoOriginal = {
                    label: ultimoAddressMatch.nombre,
                    quantity: ultimoAddressMatch.cantidad,
                    value: ultimoAddressMatch.id
                };
                departments.forEach((c) => {
                    const id = c.id;
                    if (addressMatches[0].idPadre == id) {
                        departamento.push(c);
                    }
                });
                districtsAll.forEach((c) => {
                    const idPadre = c.idPadre;
                    if (departamento[0]?.id.toString() === idPadre?.toString()) {
                        districtbydepartment.push(c);
                    }
                })
            }
            if (addressMatches.length > 0 && ultimoAddressMatch) {
                distritoOriginal = {
                  label: ultimoAddressMatch.nombre,
                  quantity: ultimoAddressMatch.cantidad,
                  value: ultimoAddressMatch.id
                };
            
                departments.forEach((c) => {
                  const id = c.id;
            
                  if (addressMatches[0].idPadre?.toString() === id.toString()) {
                    departamento.push(c);
                  }
                });
            
                districtsAll.forEach((c) => {
                  const idPadre = c.idPadre;
                  if (departamento[0]?.id.toString() === idPadre?.toString()) {
                    districtbydepartment.push(c);
                  }
                });
              }
            
              if (typeof callback === 'function') {
                if (distritoOriginal !== null) {
                  const departmentsAllAux = districtsAll.filter((district)=>district.idPadre === departamento[0]?.id);
                  callback({
                    idUbigeo: departamento[0]?.id.toString(),
                    department: { value: departamento[0]?.id, label: departamento[0]?.nombre?? "", quantity: departamento[0]?.cantidad },
                    district: distritoOriginal,
                    latitude: latitude,
                    longitude: longitude,
                    address: addressToFind,
                    districtbydepartment: departmentsAllAux,
                  });
                }
              }
        }

};