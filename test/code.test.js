// const getSubModules = {
//     methods: {
//         getSubModules: function(moduleCode) {
//             var modules = this.modules;
//             var subModules = {};
//             let that=this;
//             Object.keys(modules).forEach(function(key) {
//                 if (key == moduleCode){
//                     subModules = modules[key].subModules; 
//                 }
//             });
//             return subModules;
//         },
//     }
// };

describe('getSubModules method', () => {
    it('should return subModules for a given moduleCode', () => {
        const mockModules = {
            'module1': { subModules: ['submodule1', 'submodule2'] },
            'module2': { subModules: ['submodule3', 'submodule4'] }
        };
        const mockThis = { modules: mockModules };
        
        const result = getSubModules.methods.getSubModules.call(mockThis, 'module1');
        
        expect(result).toEqual(['submodule1', 'submodule2']);
    });
    
    it('should return an empty object if moduleCode is not found', () => {
        const mockModules = {
            'module1': { subModules: ['submodule1', 'submodule2'] },
            'module2': { subModules: ['submodule3', 'submodule4'] }
        };
        const mockThis = { modules: mockModules };
        
        const result = getSubModules.methods.getSubModules.call(mockThis, 'module3');
        
        expect(result).toEqual({});
    });
});