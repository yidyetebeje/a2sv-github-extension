#include <string>
class Solution {
public:
    string convert(string s, int numRows) {
        int dividingFactor = 2 * numRows - 2;
        if (numRows == 1) {
            dividingFactor = 1;
        }
        int groups = s.length() / dividingFactor;
        int remainder = s.length() % dividingFactor;
        string result = "";
        for (int j = 0; j < numRows; j++) {
            for (int i = 0; i < groups; i++) {
                int index = i * dividingFactor + j;
                result += s.at(index);
                if (j > 0 && j < numRows - 1) {
                    index = i * dividingFactor + dividingFactor - j;
                    result += s.at(index);
                }
            }
            if (j < remainder) {
                int index = dividingFactor * groups + j;
                result += s.at(index);
                if (j > 0 && j < numRows - 1 && dividingFactor - j < remainder) {
                    index = dividingFactor * groups + dividingFactor - j;
                    result += s.at(index);
                }
            }                
        }
        return result;
    }
};