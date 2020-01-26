const noomman = require('noomman');
require('../../src/models/index');

const ClassModel = noomman.ClassModel;
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;

const database = require('../helpers/database');
const Address = require('../../src/models/Geography/Address');
const GeographicMap = require('../../src/models/Geography/GeographicMap');
const GeographicArea = require('../../src/models/Geography/GeographicArea');
const MapType = require('../../src/models/Geography/MapType');

describe('Create Geography', () => {
    before(async () => {
        await database.connect();
        await Address.clear();
        await GeographicMap.clear();
        await GeographicArea.clear();
        await MapType.clear();
    });

    after(async () => {
        await database.close();
    });

    it ('Create MapTypes, GeographicMaps, and GeographicAreas and Addresses', async () => {
        const streetType = new Instance(MapType);
        const cityType = new Instance(MapType);
        const countyType = new Instance(MapType);
        const stateType = new Instance(MapType);
        const countryType = new Instance(MapType);

        streetType.name = 'Street';
        cityType.name = 'City';
        countyType.name = 'County';
        stateType.name = 'State';
        countryType.name = 'Country';

        await (new InstanceSet(MapType, [streetType, cityType, countyType, stateType, countryType])).save();

        const usMap = new Instance(GeographicMap);
        const californiaMap = new Instance(GeographicMap);
        const marinMap = new Instance(GeographicMap);
        const novatoMap = new Instance(GeographicMap);
        const harborDriveMap = new Instance(GeographicMap);
        const unitedStates = new Instance(GeographicArea);
        const california = new Instance(GeographicArea);
        const marin = new Instance(GeographicArea);
        const novato = new Instance(GeographicArea);
        const harborDrive = new Instance(GeographicArea);

        usMap.name = 'Map of United States Of America';
        californiaMap.name = 'Map of California';
        marinMap.name = 'Map of Marin Country';
        novatoMap.name = 'Map of Novato';
        harborDriveMap.name = 'Map of Harbor Drive';

        unitedStates.name = 'United States Of America';
        california.name = 'California';
        marin.name = 'Marin Country';
        novato.name = 'Novato';
        harborDrive.name = 'Harbor Drive';

        usMap.assign({
            mapType: countryType,
            ofGeographicArea: unitedStates,
            containsGeographicAreas: new InstanceSet(GeographicArea, [california]),
        });

        californiaMap.assign({
            mapType: stateType,
            ofGeographicArea: california,
            containsGeographicAreas: new InstanceSet(GeographicArea, [marin]),
        });

        marinMap.assign({
            mapType: countyType,
            ofGeographicArea: marin,
            containsGeographicAreas: new InstanceSet(GeographicArea, [novato]),
        });

        novatoMap.assign({
            mapType: cityType,
            ofGeographicArea: novato,
            containsGeographicAreas: new InstanceSet(GeographicArea, [harborDrive]),
        });

        harborDriveMap.assign({
            mapType: streetType,
            ofGeographicArea: harborDrive,
        });

        await usMap.save();
        await californiaMap.save();
        await marinMap.save();
        await novatoMap.save();
        await harborDriveMap.save();

        const addresses = new InstanceSet(Address);
        for (let i = 0; i < 110; i++) {
            const address = new Instance(Address);
            address.assign({
                streetNumber: String(i),
                street: harborDrive,
                city: novato,
                state: california,
                country: unitedStates,
            });
            addresses.add(address);
        }

        await addresses.save();
    });


});
