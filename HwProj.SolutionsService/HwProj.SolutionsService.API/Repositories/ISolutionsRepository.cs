﻿using System.Threading.Tasks;
using HwProj.Repositories;
using HwProj.SolutionsService.API.Models;

namespace HwProj.SolutionsService.API.Repositories
{
    public interface ISolutionsRepository : ICrudRepository<Solution>
    {
        Task UpdateSolutionStateAsync(long solutionId, SolutionState newState);
    }
}