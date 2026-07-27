import logger from "../config/logger.config";
import Docker from "dockerode";

export interface CreateContainerOptions{
    imageName:string;
    cmdExecutable:string[];
    memoryLimit:number;
}
export async function createNewDockerContainer(options:CreateContainerOptions){
    try{
        const docker= new Docker();
        const container = await docker.createContainer({
            Image: options.imageName,
            Cmd: options.cmdExecutable,
            AttachStdin: true, // to allow stdin
            AttachStdout: true, // to allow stdout
            AttachStderr: true, // to allow stderr
            Tty: false,
            OpenStdin: true, // keep the input stream open even if no input is provided
            HostConfig: {
                Memory: options.memoryLimit,
                PidsLimit: 100, // to limit the number of processes
                CpuQuota: 50000,
                CpuPeriod: 100000,
                SecurityOpt: ['no-new-privileges'], // to prevent privilege escalation
                NetworkMode: 'none', // to prevent network access
            }
        });
        // const container = await docker.createContainer({
        //     Image: options.imageName,
        //     Cmd: options.cmdExecutable,
        //     AttachStdin: true,
        //     AttachStdout: true,
        //     AttachStderr: true,
        //     Tty: false,
        //     OpenStdin: true,
          
        //     // 1. Force execution as a non-root user
        //     User: 'nobody', // or '1000:1000'
          
        //     HostConfig: {
        //       Memory: options.memoryLimit, // e.g., 128 * 1024 * 1024 (128MB)
        //       PidsLimit: 50,               // Reduced from 100 (50 is plenty for single script execution)
        //       CpuQuota: 50000,             // 0.5 CPU core limit
        //       CpuPeriod: 100000,
        //       SecurityOpt: ['no-new-privileges'],
        //       NetworkMode: 'none',
          
        //       // --- SECURITY ADDITIONS ---
          
        //       // 2. Disable Swap Memory Expansion
        //       MemorySwap: options.memoryLimit, // Setting MemorySwap equal to Memory means 0 Swap is allowed
          
        //       // 3. Drop all Linux Kernel Capabilities
        //       CapDrop: ['ALL'],
          
        //       // 4. Lock the filesystem to Read-Only
        //       ReadonlyRootfs: true,
          
        //       // 5. Provide a safe, isolated, size-limited temp storage
        //       Tmpfs: {
        //         '/tmp': 'rw,nosuid,size=64m', // 64MB RAM disk for temp/compiled files
        //       },
          
        //       // 6. Limit output file sizes and process handles
        //       Ulimits: [
        //         { Name: 'fsize', Soft: 10 * 1024 * 1024, Hard: 10 * 1024 * 1024 }, // Max 10MB file creation
        //         { Name: 'nofile', Soft: 64, Hard: 64 },                             // Max 64 open file descriptors
        //       ],
          
        //       // 7. Clean up container filesystem on exit
              
        //     },
        //   });
        logger.info(`Container Created with id assigned ${container.id}`);
        return container;
    }
    catch(err){
        logger.error("Error Creating the Container ",err);
        return null;

    }
    
}